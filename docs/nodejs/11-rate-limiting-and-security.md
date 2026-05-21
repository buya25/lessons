---
sidebar_position: 12
---

# 11 — Rate Limiting and Security

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** protect your API from abuse with rate limiting, set security headers, and avoid the most common Node.js security mistakes.

---

## The Hook

An open API without protection is an invitation for abuse.  
A bot can try 10,000 password combinations per second. A careless `eval()` can execute attacker code.

Security is not an afterthought — these protections take minutes to add.

---

## Rate Limiting

Limit how many requests a client can make in a time window:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit'

// Global: 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { error: 'Too many requests, please try again later' },
})

// Stricter for auth routes: 10 attempts per hour
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max:      10,
  message:  { error: 'Too many login attempts. Try again in an hour' },
})

app.use(globalLimiter)
app.use('/api/auth', authLimiter)
```

---

## Helmet — Security Headers

```bash
npm install helmet
```

```javascript
import helmet from 'helmet'

app.use(helmet())
```

One line. Helmet sets a dozen HTTP headers that protect against:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME type sniffing
- And more

Always include it.

---

## Input Sanitisation

Never trust user input in queries — use parameterised queries (already covered).  
But also strip dangerous characters from text inputs:

```bash
npm install express-validator
```

```javascript
import { body, validationResult } from 'express-validator'

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  // proceed with registration
})
```

---

## Environment Variables — Never Hardcode Secrets

```javascript
// Wrong — visible in git history forever
const secret = 'mysecret123'

// Correct
const secret = process.env.JWT_SECRET
if (!secret) throw new Error('JWT_SECRET not set')
```

Validate required env vars on startup:

```javascript
const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}
```

The server refuses to start if any required variable is missing — better than a confusing runtime error.

---

## Things to Never Do

```javascript
// Never — executes arbitrary code
eval(userInput)

// Never — allows importing any path
require(userInput)

// Never — SQL injection
`SELECT * FROM users WHERE id = ${req.params.id}`

// Never — path traversal
fs.readFile('/files/' + req.params.filename)

// Safe version of path traversal
const safePath = path.join('/files', path.basename(req.params.filename))
```

---

## CORS Checklist

```javascript
// Development — allow React dev server
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

// Production — allow only your real domain
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true,
}))

// Never in production:
app.use(cors())  // allows any origin
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| No rate limiting on auth | Brute-force password attacks | Add strict limiter on `/api/auth` |
| `app.use(cors())` with no origin | Any website can call your API | Always specify allowed origins |
| Secrets in source code | Credentials in git history forever | Use `.env`, never hardcode |
| Detailed error messages in production | Exposes internals to attackers | Generic messages in prod, details in server logs |

---

## Checkpoint

- [ ] Rate limiter applied globally and strictly on auth routes
- [ ] `helmet()` added before all routes
- [ ] `express-validator` validates at least one route
- [ ] All required env vars validated on startup
- [ ] CORS configured with explicit origin list

---

**Next lesson:** [12 — Testing with Jest](./12-testing-with-jest)
