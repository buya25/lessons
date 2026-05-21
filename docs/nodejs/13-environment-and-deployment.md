---
sidebar_position: 14
---

# 13 — Environment Variables and Deployment Prep

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** configure your app for multiple environments, validate required variables on startup, and prepare your Express app for production.

---

## The Hook

Your laptop is not the server.  
The database password on your machine is not the one in production.

Environment variables solve this — one codebase that behaves differently depending on where it runs.

---

## .env vs Environment

| File / Source | When it's used |
|---------------|----------------|
| `.env` (local file) | Development only — never committed to git |
| Host environment variables | Set on the server, CI/CD pipeline, or Docker |
| `.env.test` | Values used during `npm test` |

The `.env` file is a **local convenience**. In production, you set variables directly on the server.

---

## dotenv Setup

```bash
npm install dotenv
```

Load it once, as early as possible:

```javascript
// index.js — very first lines
import 'dotenv/config'  // or: import dotenv from 'dotenv'; dotenv.config()

import app from './app.js'
```

Now `process.env.DB_HOST` reads from your `.env` file in development and from the actual environment in production.

---

## .env File

```bash
# .env  (never commit this)
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommerce
JWT_SECRET=change-this-to-a-long-random-string
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

`.gitignore` must include:
```
node_modules/
.env
uploads/
```

---

## Validate Required Variables on Startup

```javascript
// config/env.js
const required = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
]

for (const key of required) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

export const config = {
  port:      parseInt(process.env.PORT) || 3000,
  db: {
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwtSecret:  process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv:    process.env.NODE_ENV || 'development',
}
```

Import it before anything else in `index.js`:

```javascript
import './config/env.js'   // validates and exports config
import app from './app.js'
import { config } from './config/env.js'

app.listen(config.port, () => {
  console.log(`Server on port ${config.port} (${config.nodeEnv})`)
})
```

---

## NODE_ENV — Development vs Production

```javascript
import { config } from './config/env.js'

const isProd = config.nodeEnv === 'production'

// Error handler — full details in dev, generic in prod
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    error: isProd ? 'Something went wrong' : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  })
})
```

In development you see the full stack trace.  
In production you see a generic message — and the real error goes to your server logs.

---

## .env.test for Tests

Create a separate file for test runs:

```bash
# .env.test
DB_NAME=ecommerce_test
JWT_SECRET=test-secret
NODE_ENV=test
```

Tell Jest to load it:

```json
// package.json
"jest": {
  "testEnvironment": "node",
  "setupFiles": ["<rootDir>/tests/setup.js"]
}
```

```javascript
// tests/setup.js
import { config } from 'dotenv'
config({ path: '.env.test' })
```

Tests now run against a separate `ecommerce_test` database — production data stays safe.

---

## Final Project Structure

```
my-api/
├── config/
│   └── env.js           ← validates + exports all config
├── routes/
│   ├── auth.js
│   └── products.js
├── middleware/
│   ├── authenticate.js
│   └── asyncHandler.js
├── utils/
│   ├── db.js            ← connection pool
│   └── validate.js
├── uploads/             ← gitignored
├── tests/
│   ├── setup.js
│   ├── helpers.js
│   └── products.test.js
├── app.js               ← Express setup, no .listen()
├── index.js             ← imports config, calls app.listen()
├── .env                 ← gitignored
├── .env.test            ← gitignored
├── .gitignore
└── package.json
```

---

## Pre-deployment Checklist

Before you push to production:

- [ ] `.env` is in `.gitignore` and never in git history
- [ ] All required variables validated on startup (`process.exit(1)` if missing)
- [ ] `NODE_ENV=production` set on the server
- [ ] Error handler returns generic messages in production
- [ ] CORS allows only your real domain
- [ ] Rate limiting enabled
- [ ] `helmet()` added
- [ ] No `console.log(password)` or secrets logged anywhere

---

## Predict Before You Run

```javascript
import 'dotenv/config'

const port = parseInt(process.env.PORT) || 3000
console.log(typeof port)
console.log(port + 1)
```

If `.env` has `PORT=3000`, what does this print?

<details>
<summary>Answer</summary>

```
number
3001
```

`parseInt()` converts the string `'3000'` to the number `3000`. Adding `1` gives `3001`.  
Without `parseInt`, `process.env.PORT + 1` would give the string `'30001'` — all env vars are strings.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Committing `.env` | Credentials in git history forever | Check `.gitignore` before every first commit |
| No startup validation | Runtime crash deep in a request, confusing error | Validate at startup, fail fast |
| Using the same DB for tests | Tests delete production data | Separate `DB_NAME` in `.env.test` |
| `process.env.PORT + 1` without parseInt | String concatenation instead of addition | Always `parseInt()` numeric env vars |

---

## Checkpoint

- [ ] `dotenv` installed and loaded as the first import in `index.js`
- [ ] `.env` file created and added to `.gitignore`
- [ ] `config/env.js` validates required variables and exports a `config` object
- [ ] Error handler returns different messages based on `NODE_ENV`
- [ ] `.env.test` exists with a separate test database name

---

**Next lesson:** [14 — Logging and Debugging](./14-logging-and-debugging)
