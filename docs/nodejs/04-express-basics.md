---
sidebar_position: 5
---

# 04 — Express Basics

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** build a web server with Express, define routes, and send JSON responses.

---

## The Hook

In lesson 02, routing in raw Node.js was a wall of `if/else`.  
Express turns that into clean, readable route definitions — the same pattern used by millions of servers worldwide.

---

## Your First Express Server

Create `index.js`:

```javascript
import express from 'express'

const app  = express()
const PORT = 3000

app.use(express.json())  // parse JSON request bodies automatically

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
```

Run with nodemon:
```bash
npm run dev
```

---

## Route Methods

```javascript
app.get('/products',       handler)  // GET — retrieve
app.post('/products',      handler)  // POST — create
app.put('/products/:id',   handler)  // PUT — replace
app.patch('/products/:id', handler)  // PATCH — update fields
app.delete('/products/:id', handler) // DELETE — remove
```

---

## Route Parameters and Query Strings

**URL parameters** (`:id` in the path):
```javascript
app.get('/products/:id', (req, res) => {
  const { id } = req.params
  res.json({ message: `You requested product ${id}` })
})
// GET /products/42 → { message: "You requested product 42" }
```

**Query strings** (`?key=value` after the path):
```javascript
app.get('/products', (req, res) => {
  const { category, minPrice } = req.query
  res.json({ category, minPrice })
})
// GET /products?category=bags&minPrice=100 → { category: "bags", minPrice: "100" }
```

**Request body** (POST/PUT):
```javascript
app.post('/products', (req, res) => {
  const { name, price } = req.body  // requires express.json() middleware
  res.status(201).json({ name, price })
})
```

---

## Response Methods

```javascript
res.send('plain text')
res.json({ key: 'value' })        // sets Content-Type: application/json
res.status(404).json({ error: 'Not found' })
res.status(201).json({ id: 1 })
res.redirect('/login')
res.sendFile('/path/to/file.html')
```

---

## Build It — In-memory Products API

Before adding a database, build it with hardcoded data to test routing:

```javascript
import express from 'express'

const app = express()
app.use(express.json())

let products = [
  { id: 1, name: 'Notebook', price: 150, stock: 200 },
  { id: 2, name: 'Pen',      price: 20,  stock: 500 },
  { id: 3, name: 'Backpack', price: 850, stock: 45  },
]

app.get('/api/products', (req, res) => {
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id))
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

app.post('/api/products', (req, res) => {
  const { name, price, stock = 0 } = req.body
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'name and price required' })
  }
  const newProduct = { id: products.length + 1, name, price, stock }
  products.push(newProduct)
  res.status(201).json(newProduct)
})

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Not found' })
  products.splice(index, 1)
  res.json({ message: 'Deleted' })
})

app.listen(3000, () => console.log('Running on port 3000'))
```

Test with curl:
```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products/1
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Ruler","price":15}'
```

---

## Predict Before You Run

```javascript
app.get('/items/:id', (req, res) => {
  res.json({ id: req.params.id, type: typeof req.params.id })
})
```

What does `GET /items/42` return?

<details>
<summary>Answer</summary>

```json
{ "id": "42", "type": "string" }
```

URL parameters are always **strings** — even if they look like numbers. Always use `parseInt(req.params.id)` when you need a number.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Forgetting `app.use(express.json())` | `req.body` is `undefined` | Add it before your routes |
| Comparing `req.params.id === 1` (strict equals) | Never matches — params are strings | Use `parseInt(req.params.id)` |
| Not calling `return` before `res.status().json()` in a condition | "Cannot set headers after they are sent" | Add `return` to stop execution |

---

## Checkpoint

- [ ] Express server running with nodemon
- [ ] All 4 routes work (GET all, GET one, POST, DELETE)
- [ ] Tested with curl or a browser
- [ ] `req.params`, `req.query`, `req.body` all demonstrated

---

**Next lesson:** [05 — Middleware](./05-middleware)
