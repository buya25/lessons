---
sidebar_position: 13
---

# 12 — Testing with Jest

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** write and run unit and integration tests for your Express API using Jest and Supertest.

---

## The Hook

Every change you make could break something else.  
Tests catch regressions automatically so you can ship with confidence.

---

## Install

```bash
npm install --save-dev jest supertest
```

Add to `package.json`:
```json
"scripts": {
  "test": "node --experimental-vm-modules node_modules/.bin/jest"
},
"jest": {
  "testEnvironment": "node"
}
```

The `--experimental-vm-modules` flag is needed for ES modules with Jest.

---

## Unit Test — Testing a Pure Function

`utils/validate.js`:
```javascript
export function validateProduct(data) {
  const errors = {}
  if (!data.name)           errors.name  = 'name is required'
  if (data.price === undefined) errors.price = 'price is required'
  if (data.price < 0)       errors.price = 'price must be >= 0'
  return errors
}
```

`tests/validate.test.js`:
```javascript
import { validateProduct } from '../utils/validate.js'

describe('validateProduct', () => {
  test('returns no errors for valid product', () => {
    const errors = validateProduct({ name: 'Notebook', price: 150 })
    expect(errors).toEqual({})
  })

  test('returns error when name missing', () => {
    const errors = validateProduct({ price: 150 })
    expect(errors.name).toBe('name is required')
  })

  test('returns error when price is negative', () => {
    const errors = validateProduct({ name: 'Test', price: -1 })
    expect(errors.price).toBe('price must be >= 0')
  })
})
```

---

## Integration Test — Testing API Routes

`tests/products.test.js`:
```javascript
import request from 'supertest'
import app     from '../app.js'  // export app without .listen()

describe('GET /api/products', () => {
  test('returns 200 and an array', async () => {
    const res = await request(app).get('/api/products')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /api/products', () => {
  test('returns 401 without token', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test', price: 100 })
    expect(res.statusCode).toBe(401)
  })

  test('returns 400 with missing price', async () => {
    const token = getTestToken()  // helper that generates a test JWT
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test' })
    expect(res.statusCode).toBe(400)
  })
})
```

**Separate `app.js` from the server startup** to make testing possible:

`app.js` — exports the Express app:
```javascript
import express from 'express'
import cors    from 'cors'
import productsRouter from './routes/products.js'
import authRouter     from './routes/auth.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/products', productsRouter)
app.use('/api/auth',     authRouter)

export default app
```

`index.js` — starts the server:
```javascript
import app from './app.js'

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server on port ${PORT}`))
```

Tests import `app.js` — the server never starts during testing.

---

## Test Helpers

```javascript
// tests/helpers.js
import jwt from 'jsonwebtoken'

export function getTestToken(userId = 1) {
  return jwt.sign(
    { userId, email: 'test@test.com' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  )
}
```

---

## Running Tests

```bash
npm test           # run all tests
npm test -- --watch  # re-run on file change
npm test -- --coverage  # show coverage report
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `app.listen()` in the same file you export | Tests try to start a server — separate `app.js` and `index.js` |
| Tests that depend on database state | Use a test database or mock the db module |
| No test for the failure path | Only happy-path tests miss bugs in error handling |

---

## Checkpoint

- [ ] Jest and Supertest installed
- [ ] `app.js` exports the Express app without `.listen()`
- [ ] Unit test for `validateProduct` passes
- [ ] Integration tests cover 200, 400, and 401 for at least one route
- [ ] `npm test` runs all tests green

---

**Next lesson:** [13 — Environment and Deployment Prep](./13-environment-and-deployment)
