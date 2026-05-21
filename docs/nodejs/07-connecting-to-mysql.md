---
sidebar_position: 8
---

# 07 — Connecting to MySQL

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** connect Node.js to MySQL, run queries with a promise-based API, and use a connection pool.

---

## The Hook

The Python API and the Node.js chat app share the same database.  
This lesson connects Node.js to it — using mysql2, which is faster and supports promises natively.

---

## Install

```bash
npm install mysql2 dotenv
```

---

## .env File

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce
JWT_SECRET=a_long_random_secret_string
PORT=3000
```

---

## db.js — Connection Pool

A **pool** manages multiple database connections. Instead of creating and closing a connection per query (slow), the pool keeps connections open and reuses them.

```javascript
import mysql  from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
})

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export default pool
```

`pool.execute()` returns `[rows, fields]` — we destructure just `rows`.

---

## Using It in Routes

```javascript
import { query } from '../db.js'

router.get('/', async (req, res, next) => {
  try {
    const products = await query(
      'SELECT id, name, price, stock FROM products WHERE is_active = TRUE'
    )
    res.json(products)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const [product] = await query(
      'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      [req.params.id]
    )
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, price, stock = 0 } = req.body
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'name and price required' })
    }
    const result = await query(
      'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
      [name, price, stock]
    )
    res.status(201).json({ id: result.insertId, name, price, stock })
  } catch (err) {
    next(err)
  }
})
```

---

## Transactions in Node.js

For operations that must be atomic (like placing an order):

```javascript
async function placeOrder(userId, items, address) {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const [orderResult] = await conn.execute(
      'INSERT INTO orders (user_id, shipping_address, total) VALUES (?, ?, ?)',
      [userId, address, 0]
    )
    const orderId = orderResult.insertId
    let total = 0

    for (const item of items) {
      const [[product]] = await conn.execute(
        'SELECT price, stock FROM products WHERE id = ? FOR UPDATE',
        [item.product_id]
      )
      if (!product || product.stock < item.quantity) {
        await conn.rollback()
        return { error: `Insufficient stock for product ${item.product_id}` }
      }
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, product.price]
      )
      await conn.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      )
      total += product.price * item.quantity
    }

    await conn.execute('UPDATE orders SET total = ? WHERE id = ?', [total, orderId])
    await conn.commit()
    return { orderId, total }
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
```

`conn.release()` returns the connection to the pool — **always release in `finally`**.

---

## Predict Before You Run

```javascript
const [product] = await query('SELECT * FROM products WHERE id = ?', [99999])
console.log(product)
```

What does this log if product 99999 does not exist?

<details>
<summary>Answer</summary>

`undefined` — `query` returns an empty array, and destructuring the first element of an empty array gives `undefined`.

Always check `if (!product)` after fetching a single row.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Using `mysql` instead of `mysql2` | No promise support | `npm install mysql2` |
| Forgetting `conn.release()` | Pool exhausted — server hangs | Always release in `finally` |
| String interpolation in SQL: `` `WHERE id = ${id}` `` | SQL injection | Always use `?` placeholders |

---

## Checkpoint

- [ ] `db.js` exports a `query()` function using a connection pool
- [ ] `GET /api/products` returns real data from MySQL
- [ ] `POST /api/products` inserts a row and returns the new ID
- [ ] Transaction pattern implemented for order placement

---

**Next lesson:** [08 — Async/Await and Error Handling](./08-async-await)
