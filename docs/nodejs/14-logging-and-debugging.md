---
sidebar_position: 15
---

# 14 — Logging and Debugging

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** add structured logging to your app, read Node.js error messages, use the debugger, and track down bugs systematically.

---

## The Hook

`console.log` is a blunt instrument.  
It mixes your debug prints with real log lines. It has no log levels. You can't search it. In production, you can't see it at all.

This lesson teaches you to log properly and read errors like a developer.

---

## Why console.log Falls Short

```javascript
// What gets mixed in your terminal:
Server on port 3000
User connected: abc123
{ name: 'debug print', id: 1 }   ← which file? which request?
GET /api/products 200 45ms
User disconnected: abc123
```

You can't tell which log came from which request, or how urgent it is.

---

## Log Levels

Production logging uses levels so you can filter by severity:

| Level | When to use |
|-------|------------|
| `error` | Something broke — needs attention |
| `warn` | Unexpected but recoverable — rate limit hit, deprecated usage |
| `info` | Normal operations — server started, user logged in |
| `debug` | Detailed internals — only in development |

---

## Morgan — HTTP Request Logging

```bash
npm install morgan
```

```javascript
import morgan from 'morgan'

// Development: colorful, verbose
app.use(morgan('dev'))

// Production: compact, machine-readable
app.use(morgan('combined'))
```

`morgan('dev')` output:
```
GET /api/products 200 45.123 ms - 312
POST /api/auth/login 401 12.456 ms - 35
```

Every HTTP request logged automatically — you never write these yourself.

---

## Winston — Structured Application Logging

```bash
npm install winston
```

```javascript
// utils/logger.js
import winston from 'winston'

const isProd = process.env.NODE_ENV === 'production'

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: isProd
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
  transports: [
    new winston.transports.Console(),
  ],
})
```

Use it everywhere instead of `console.log`:

```javascript
import { logger } from '../utils/logger.js'

logger.info('Server started', { port: 3000 })
logger.warn('Rate limit hit', { ip: req.ip })
logger.error('Database error', { error: err.message, query: sql })
logger.debug('Query result', { rows: result.length })
```

In production the JSON format makes logs searchable:
```json
{"level":"error","message":"Database error","error":"Connection refused","query":"SELECT..."}
```

---

## Replace console.log in Your Error Handler

```javascript
import { logger } from './utils/logger.js'

app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack:   err.stack,
    method:  req.method,
    url:     req.url,
    ip:      req.ip,
  })

  const status = err.status || 500
  const isProd = process.env.NODE_ENV === 'production'

  res.status(status).json({
    error: isProd ? 'Something went wrong' : err.message,
  })
})
```

---

## Reading Node.js Error Messages

### The anatomy of a stack trace:

```
Error: Cannot read properties of undefined (reading 'name')
    at Object.<anonymous> (/app/routes/products.js:24:21)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:149:13)
```

**Read from top to bottom:**
1. The error message — what went wrong
2. The first line with YOUR file path — this is where the bug is (line 24, column 21)
3. Ignore the `node_modules` lines — those are framework internals

Always jump to **the first line that names a file you wrote**.

---

## Common Errors and What They Mean

| Error message | What it means | Where to look |
|---------------|--------------|---------------|
| `Cannot read properties of undefined` | You called `.something` on `undefined` | The line before — what did you expect to be there? |
| `ReferenceError: x is not defined` | Variable `x` doesn't exist in this scope | Typo? Forgot to import? Wrong scope? |
| `SyntaxError: Cannot use import statement` | ES module config missing | `"type": "module"` in package.json |
| `ECONNREFUSED` | Can't connect to a server (DB, external API) | Is the service running? Is the host/port correct? |
| `ENOENT: no such file or directory` | File path is wrong | Log the path — check for typos |
| `UnhandledPromiseRejection` | `await` threw and no `try/catch` caught it | Wrap in `asyncHandler` or add `try/catch` |

---

## The Node.js Debugger

Add a `debugger` statement anywhere:

```javascript
router.get('/:id', asyncHandler(async (req, res) => {
  const [product] = await query('SELECT * FROM products WHERE id = ?', [req.params.id])
  debugger  // pauses execution here
  res.json(product)
}))
```

Start with the inspect flag:

```bash
node --inspect index.js
```

Open Chrome and go to `chrome://inspect` → click "Open dedicated DevTools for Node".  
You can now step through code, inspect variables, and see the call stack — exactly like browser DevTools.

Or use VS Code: press F5 with a launch config.

---

## Debugging Checklist — When Something Is Wrong

1. **Read the full error message** — don't skim it
2. **Find YOUR file in the stack trace** — ignore `node_modules` lines
3. **Log the inputs** — what does `req.body`, `req.params`, `result` actually contain?
4. **Check the database directly** — does the row exist? Is the data what you expect?
5. **Reproduce it in isolation** — can you write a failing test for it?
6. **Check recent changes** — `git diff` — what changed right before this broke?

---

## Break It

This logger setup has a bug. Find it:

```javascript
import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize()
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
})
```

<details>
<summary>What is wrong?</summary>

Missing comma after `winston.format.colorize()`.  
`winston.format.combine()` takes multiple arguments separated by commas. Without the comma, it's a syntax error.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| `console.log` in production | No log levels, no structure, easy to miss errors | Use a logger with levels |
| Logging passwords or tokens | Security breach in log files | Never log request body wholesale; exclude sensitive fields |
| Ignoring the stack trace | Can't find the bug | Always read it; jump to your file first |
| No request ID in logs | Can't trace one request across multiple log lines | Add a request ID to each log entry |

---

## Checkpoint

- [ ] `morgan` added for HTTP request logging
- [ ] `winston` logger created in `utils/logger.js`
- [ ] Error handler uses `logger.error()` instead of `console.log`
- [ ] You can read a stack trace and identify the line causing the error
- [ ] You've started the app with `--inspect` and opened Chrome DevTools

---

**Next lesson:** [15 — Project Walkthrough](./15-project-walkthrough)
