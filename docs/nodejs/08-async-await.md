---
sidebar_position: 9
---

# 08 — Async/Await and Error Handling

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** write clean async code with async/await, handle errors properly, and avoid common async pitfalls.

---

## The Hook

Node.js is asynchronous by design — everything that touches the outside world (database, file system, network) is non-blocking.

JavaScript has evolved three ways to handle async code. Understanding all three helps you read old code and write new code correctly.

---

## The Evolution of Async JavaScript

**1. Callbacks (oldest — messy with nesting):**
```javascript
readFile('data.txt', (err, data) => {
  if (err) return console.error(err)
  parseJSON(data, (err, parsed) => {
    if (err) return console.error(err)
    saveToDatabase(parsed, (err) => {
      if (err) return console.error(err)
      console.log('Done')  // "callback hell"
    })
  })
})
```

**2. Promises (cleaner chaining):**
```javascript
readFile('data.txt')
  .then(data => parseJSON(data))
  .then(parsed => saveToDatabase(parsed))
  .then(() => console.log('Done'))
  .catch(err => console.error(err))
```

**3. Async/Await (cleanest — what we use):**
```javascript
async function process() {
  try {
    const data   = await readFile('data.txt')
    const parsed = await parseJSON(data)
    await saveToDatabase(parsed)
    console.log('Done')
  } catch (err) {
    console.error(err)
  }
}
```

Same result — three different syntaxes. Always use async/await in new code.

---

## async/await Rules

- `async` before a function makes it return a Promise automatically
- `await` pauses execution until the Promise resolves — only works inside an `async` function
- If the Promise rejects (throws), `await` throws an error — catch it with `try/catch`

```javascript
async function getProduct(id) {
  const [product] = await query('SELECT * FROM products WHERE id = ?', [id])
  return product  // automatically wrapped in a resolved Promise
}

// Calling it:
const product = await getProduct(1)    // inside async function
getProduct(1).then(p => console.log(p)) // outside async function
```

---

## Running Things in Parallel

`await` pauses one at a time — sequential. For independent operations, run them in parallel:

```javascript
// Sequential — slow (waits for each before starting the next)
const user    = await getUser(userId)
const orders  = await getOrders(userId)
const profile = await getProfile(userId)

// Parallel — faster (all start at the same time)
const [user, orders, profile] = await Promise.all([
  getUser(userId),
  getOrders(userId),
  getProfile(userId),
])
```

Use `Promise.all()` when the operations do not depend on each other.

---

## Async Route Handler Helper

Wrapping every route in `try/catch` is repetitive. Create a wrapper:

```javascript
// utils/asyncHandler.js
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

Now routes are cleaner — no try/catch needed:

```javascript
import { asyncHandler } from '../utils/asyncHandler.js'

router.get('/', asyncHandler(async (req, res) => {
  const products = await query('SELECT * FROM products')
  res.json(products)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const [product] = await query('SELECT * FROM products WHERE id = ?', [req.params.id])
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json(product)
}))
```

Errors are automatically passed to the error handling middleware.

---

## Predict Before You Run

```javascript
async function fetchAll() {
  console.log('A')
  const result = await Promise.resolve('data')
  console.log('B')
  return result
}

console.log('1')
fetchAll().then(r => console.log('C:', r))
console.log('2')
```

What is the output order?

<details>
<summary>Answer</summary>

```
1
A
2
B
C: data
```

`1` logs synchronously. `fetchAll()` starts — logs `A`, then hits `await` and yields. `2` logs synchronously. Then the event loop returns to continue `fetchAll()` — logs `B`, returns. `.then()` logs `C: data`.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `await` outside `async` function | `SyntaxError` | Wrap in `async` function |
| Forgetting `await` before a Promise | Gets a `Promise` object, not the value | Add `await` |
| Sequential `await` for independent operations | Unnecessarily slow | Use `Promise.all()` |
| No `try/catch` on `await` | Unhandled promise rejection crash | Always catch, or use `asyncHandler` wrapper |

---

## Checkpoint

- [ ] All routes use `async/await` with proper error handling
- [ ] `asyncHandler` utility created and applied to all routes
- [ ] `Promise.all()` used where operations are independent
- [ ] You can explain the output order of async code

---

**Next lesson:** [09 — File Uploads](./09-file-uploads)
