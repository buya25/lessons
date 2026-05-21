---
sidebar_position: 6
---

# 05 — Middleware

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** write and use middleware functions for logging, authentication, error handling, and CORS.

---

## The Hook

When a request comes in, it passes through a **pipeline** before reaching your route handler.  
Each step in the pipeline is a **middleware** function — it can inspect the request, modify it, block it, or pass it on.

`express.json()` is middleware. CORS is middleware. Auth checks are middleware.

---

## Middleware Signature

```javascript
function myMiddleware(req, res, next) {
  // do something with req or res
  next()  // pass control to the next middleware or route
}
```

Three parameters: `req`, `res`, and `next`.  
Call `next()` to continue. If you don't call `next()`, the request hangs forever.

---

## Applying Middleware

```javascript
// Global — runs on every request
app.use(myMiddleware)

// Specific route
app.get('/products', myMiddleware, (req, res) => { ... })

// Multiple on one route
app.post('/products', authenticate, validate, createProduct)
```

Order matters — middleware runs top to bottom.

---

## Logger Middleware

```javascript
function logger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} — ${Date.now() - start}ms`)
  })
  next()
}

app.use(logger)
```

Every request now logs: `GET /api/products 200 — 12ms`

---

## CORS Middleware

Browsers block requests from a different origin (e.g., React on port 5173 calling Node on port 3000).  
CORS headers tell the browser it is allowed.

```bash
npm install cors
```

```javascript
import cors from 'cors'

app.use(cors({
  origin: 'http://localhost:5173',  // your React app
  credentials: true,
}))
```

In production, set `origin` to your real domain.

---

## Auth Middleware

```javascript
import jwt from 'jsonwebtoken'

function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' })
  }

  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Apply to protected routes
app.get('/api/orders', authenticate, getOrders)
app.post('/api/orders', authenticate, createOrder)
```

---

## Validation Middleware

```javascript
function validateProduct(req, res, next) {
  const { name, price } = req.body
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' })
  }
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'price must be a non-negative number' })
  }
  next()
}

app.post('/api/products', authenticate, validateProduct, createProduct)
```

---

## Error Handling Middleware

A special middleware with **4 parameters** — Express recognises it as an error handler:

```javascript
// Must be the LAST app.use() call
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})
```

Trigger it by calling `next(error)` from any middleware or route:

```javascript
app.get('/api/products/:id', async (req, res, next) => {
  try {
    const product = await getProduct(req.params.id)
    res.json(product)
  } catch (err) {
    next(err)  // passes to error handler middleware
  }
})
```

---

## 404 Middleware

Catch all routes that did not match:

```javascript
// After all routes, before error handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` })
})
```

---

## Middleware Order in index.js

```javascript
// 1. Built-in middleware
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

// 2. Custom global middleware (logger, rate limiter, etc.)
app.use(logger)

// 3. Routes
app.use('/api/products', productRouter)
app.use('/api/auth',     authRouter)

// 4. 404 handler — after all routes
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

// 5. Error handler — always last
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message })
})
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Forgetting `next()` | Request hangs forever | Always call `next()` unless sending a response |
| Error handler with 3 params instead of 4 | Not recognised as error handler | Must have exactly `(err, req, res, next)` |
| Routes after error handler | Unreachable routes | Error handler must be last |
| CORS middleware after routes | CORS headers not set on some requests | Always put CORS before routes |

---

## Checkpoint

- [ ] Logger middleware logs every request with method, URL, status, and time
- [ ] CORS middleware allows requests from the React dev server
- [ ] Auth middleware protects at least one route
- [ ] Error handling middleware catches errors passed via `next(err)`
- [ ] 404 middleware returns a clean JSON response

---

**Next lesson:** [06 — Routing with Express Router](./06-express-router)
