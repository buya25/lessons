---
sidebar_position: 7
---

# 06 — Routing with Express Router

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** split routes into separate files using Express Router to keep your code organised.

---

## The Hook

Every route in one `index.js` becomes unmanageable fast.  
Express Router lets you split routes into files — one file per resource, exactly like Flask Blueprints.

---

## Project Structure

```
chat-app/
├── index.js              ← app entry point
├── db.js                 ← database connection
├── middleware/
│   ├── auth.js           ← authenticate middleware
│   └── logger.js         ← request logger
└── routes/
    ├── auth.js           ← /api/auth/*
    ├── products.js       ← /api/products/*
    └── messages.js       ← /api/messages/*
```

---

## Creating a Router

`routes/products.js`:

```javascript
import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Notebook', price: 150 }])
})

router.get('/:id', (req, res) => {
  res.json({ id: parseInt(req.params.id), name: 'Notebook' })
})

router.post('/', authenticate, (req, res) => {
  const { name, price } = req.body
  res.status(201).json({ name, price })
})

router.delete('/:id', authenticate, (req, res) => {
  res.json({ message: `Product ${req.params.id} deleted` })
})

export default router
```

---

## Register Routers in index.js

```javascript
import express from 'express'
import cors    from 'cors'
import productsRouter from './routes/products.js'
import authRouter     from './routes/auth.js'

const app = express()

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

app.use('/api/products', productsRouter)
app.use('/api/auth',     authRouter)

app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => res.status(500).json({ error: err.message }))

app.listen(3000, () => console.log('Server on port 3000'))
```

The prefix `/api/products` is added automatically — inside the router, routes start from `/`.

---

## Auth Router

`routes/auth.js`:

```javascript
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt    from 'jsonwebtoken'
import { query } from '../db.js'

const router = Router()

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' })
    }
    const hash = await bcrypt.hash(password, 10)
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hash]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already registered' })
    }
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const [user] = await query('SELECT * FROM users WHERE email = ?', [email])
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({ token })
  } catch (err) {
    next(err)
  }
})

export default router
```

---

## Middleware File

`middleware/auth.js`:

```javascript
import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' })
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Forgetting `.js` in import paths | `Cannot find module` in Node ES modules | Always include `.js`: `import x from './routes/auth.js'` |
| Route path in router starting with `/products` | Double prefix: `/api/products/products` | In the router, paths start from `/`, prefix comes from `app.use()` |

---

## Checkpoint

- [ ] Routes split into `routes/products.js` and `routes/auth.js`
- [ ] Auth middleware extracted to `middleware/auth.js`
- [ ] `index.js` only registers routers — no route logic
- [ ] All existing endpoints still work after the refactor

---

**Next lesson:** [07 — Connecting to MySQL](./07-connecting-to-mysql)
