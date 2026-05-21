---
sidebar_position: 16
---

# 15 — Project Walkthrough

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** connect all 14 lessons into a complete project plan and understand how every piece fits together before you build it.

---

## The Hook

You have built individual pieces: Express routes, JWT auth, MySQL queries, WebSockets, file uploads, rate limiting, tests, logging.

Now you connect them into a real application — a live chat server with products, users, and real-time messaging.

This lesson maps each concept to where it lives in the project.

---

## What You Are Building

A **real-time chat and e-commerce API** with:
- User registration and JWT login
- Products CRUD (authenticated, with image uploads)
- Real-time chat rooms using Socket.io
- Rate limiting and security headers
- Structured logging
- Tests for critical paths

---

## The Complete File Structure

```
chat-api/
├── config/
│   └── env.js               ← lesson 13: validates all env vars
├── routes/
│   ├── auth.js              ← lessons 5–6: register, login
│   └── products.js          ← lessons 4–7: CRUD with MySQL
├── middleware/
│   ├── authenticate.js      ← lesson 5: JWT verification
│   └── asyncHandler.js      ← lesson 8: wraps async routes
├── utils/
│   ├── db.js                ← lesson 7: mysql2 connection pool
│   ├── validate.js          ← lesson 12: pure validation functions
│   └── logger.js            ← lesson 14: winston logger
├── socket/
│   └── chat.js              ← lesson 10: all socket.io event handlers
├── uploads/                 ← lesson 9: multer saves files here
├── tests/
│   ├── setup.js             ← lesson 13: loads .env.test
│   ├── helpers.js           ← lesson 12: getTestToken()
│   ├── validate.test.js     ← lesson 12: unit tests
│   └── products.test.js     ← lesson 12: integration tests
├── app.js                   ← lessons 4–5: Express setup, no .listen()
├── index.js                 ← lesson 13: loads env, starts server
├── .env                     ← lesson 13: never committed
├── .env.test                ← lesson 13: test database
├── .gitignore
└── package.json
```

---

## How the Layers Connect

```
HTTP Request
     │
     ▼
morgan (logs every request)           ← lesson 14
     │
     ▼
helmet (security headers)             ← lesson 11
     │
     ▼
cors (allow specific origins)         ← lesson 5
     │
     ▼
globalLimiter (100 req / 15 min)      ← lesson 11
     │
     ▼
Express Router
     │
     ├── /api/auth  ← authLimiter → register/login handlers
     │
     └── /api/products ← authenticate middleware → CRUD handlers
                                                         │
                                                         ▼
                                              db.query() (mysql2 pool) ← lesson 7
                                                         │
                                                         ▼
                                                     MySQL
```

---

## Tracing a Login Request

`POST /api/auth/login` with `{ email, password }`:

1. `morgan` logs the incoming request
2. `helmet` sets security headers on the response
3. `cors` checks the `Origin` header — rejects if not on the allowed list
4. `authLimiter` checks request count for this IP — returns 429 if exceeded
5. The `login` route handler runs
6. `express-validator` validates that `email` is an email and `password` is non-empty
7. `db.query('SELECT * FROM users WHERE email = ?', [email])` runs
8. `bcrypt.compare(password, user.password_hash)` verifies the password
9. `jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' })` generates the token
10. `res.json({ token, user })` sends the response
11. `logger.info('User logged in', { userId, email })` writes to the log

Any error at any step flows to the global error handler via `asyncHandler`.

---

## Tracing a Socket.io Message

User sends a `send_message` event:

1. Socket.io receives the event from the client WebSocket
2. `socket.data.userId` is checked — was the user authenticated when they connected?
3. `chatMessage` object is constructed with username, message, timestamp
4. `db.query('INSERT INTO messages ...')` saves it to MySQL
5. `io.to(roomId).emit('receive_message', chatMessage)` broadcasts to everyone in the room
6. `logger.debug('Message sent', { roomId, userId })` writes to the log

---

## Connecting auth to Socket.io

Socket.io connections can carry a JWT too:

```javascript
// socket/chat.js
import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Authentication required'))

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    socket.data.userId   = decoded.userId
    socket.data.username = decoded.email
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})
```

On the React client:
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: localStorage.getItem('token') }
})
```

---

## Test Coverage Map

| Test | What it checks |
|------|---------------|
| `validate.test.js` | Pure function — no DB, no server |
| `products.test.js` — GET 200 | Route returns data correctly |
| `products.test.js` — POST 401 | Auth middleware blocks unauthenticated requests |
| `products.test.js` — POST 400 | Validation rejects missing fields |
| `auth.test.js` — login 200 | Returns token for valid credentials |
| `auth.test.js` — login 401 | Rejects wrong password |

---

## What to Build First

When you start the capstone project, build in this order:

1. **Database** — create the tables first, everything else depends on this
2. **`config/env.js` + `utils/db.js`** — foundation every other file needs
3. **Auth routes** — register and login before anything else needs JWT
4. **Products CRUD** — basic routes, then add auth, then add file upload
5. **Socket.io** — add after the HTTP API is working
6. **Rate limiting + helmet** — add to `app.js` after routes are working
7. **Tests** — write them as you build each route
8. **Logging** — replace `console.log` calls with winston at the end

---

## Common Mistakes at Integration Time

| Mistake | How it shows up | Fix |
|---------|----------------|-----|
| Socket.io attached to `app` not `server` | WebSocket connections fail silently | `new Server(httpServer, ...)` |
| JWT secret different between routes | Token from `/login` rejected by `/products` | Single `config.jwtSecret` source |
| Tests hitting production DB | Test data pollutes prod | `.env.test` with separate DB name |
| Multer before `authenticate` | Anyone uploads files | Middleware order: `authenticate` first |

---

## Checkpoint

- [ ] You can draw the request/response flow from client to database without looking at notes
- [ ] You understand which middleware runs in which order and why
- [ ] You can explain how a Socket.io message is authenticated
- [ ] You know what order to build things in

---

**Next:** [Capstone Project — Real-Time Chat API](./project-realtime-chat)
