---
sidebar_position: 17
---

# Project — Real-Time Chat API

**Estimated time:** 3–5 hours  
**You will build:** A production-ready Node.js backend with REST endpoints for users and products, and a Socket.io chat server with authenticated rooms.

---

## What You Are Building

A backend for a full-stack e-commerce app with live chat. Users can:
- Register and log in (JWT)
- Browse and manage products
- Upload product images
- Chat in rooms in real time

This backend connects to the same MySQL database built in the SQL track and is consumed by the React frontend built in the React track.

---

## Database Setup

Use the `ecommerce` database from the SQL project. Add the chat tables:

```sql
CREATE TABLE IF NOT EXISTS rooms (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  created_by  INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  room_id    INT NOT NULL,
  user_id    INT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_messages_room ON messages(room_id, created_at);
```

---

## What to Build

### Phase 1 — Foundation

Set up the project skeleton:

```
chat-api/
├── config/env.js
├── utils/db.js
├── utils/logger.js
├── app.js
├── index.js
├── .env
└── package.json
```

Requirements:
- `config/env.js` validates these vars: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
- `utils/db.js` exports a `query(sql, params)` helper using a mysql2 pool
- `utils/logger.js` exports a winston logger (colorized in dev, JSON in prod)
- `app.js` sets up Express with helmet, morgan, and CORS — no `.listen()`
- `index.js` loads config, starts the HTTP server

---

### Phase 2 — Auth Routes

`routes/auth.js`:

| Method | Path | Auth | What it does |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Creates user, returns JWT |
| POST | `/api/auth/login` | — | Verifies credentials, returns JWT |
| GET | `/api/auth/me` | JWT | Returns the logged-in user's profile |

Rules:
- Passwords must be hashed with bcrypt (cost factor 12)
- JWT expires in 7 days
- Auth limiter: 10 requests per hour on this router
- Validate `email` and `password` with express-validator before touching the DB

---

### Phase 3 — Products Routes

`routes/products.js`:

| Method | Path | Auth | What it does |
|--------|------|------|-------------|
| GET | `/api/products` | — | Returns all products (paginated: `?page=1&limit=20`) |
| GET | `/api/products/:id` | — | Returns one product with its images |
| POST | `/api/products` | JWT | Creates a product |
| PUT | `/api/products/:id` | JWT | Updates product (owner only) |
| DELETE | `/api/products/:id` | JWT | Deletes product (owner only) |
| POST | `/api/products/:id/image` | JWT | Uploads an image for a product |

Rules:
- Products belong to a user — store `created_by` when creating
- Only the product owner can update or delete it (return 403 for others)
- Image upload: JPEG/PNG/WebP only, max 5 MB, save to `uploads/`
- Pagination: return `{ data, page, limit, total }` on GET all

---

### Phase 4 — Chat Rooms Routes

`routes/rooms.js`:

| Method | Path | Auth | What it does |
|--------|------|------|-------------|
| GET | `/api/rooms` | JWT | Lists all rooms |
| POST | `/api/rooms` | JWT | Creates a room |
| GET | `/api/rooms/:id/messages` | JWT | Returns last 50 messages for a room |

---

### Phase 5 — Socket.io Chat

`socket/chat.js`:

**Authentication middleware:**  
Verify the JWT passed in `socket.handshake.auth.token` before allowing any connection.

**Events the server listens for:**

| Event | Payload | What it does |
|-------|---------|-------------|
| `join_room` | `{ roomId }` | Joins the Socket.io room, sends last 50 messages |
| `send_message` | `{ roomId, content }` | Saves message to DB, broadcasts to room |
| `leave_room` | `{ roomId }` | Leaves the Socket.io room |
| `disconnect` | — | Notifies room members the user left |

**Events the server emits:**

| Event | To whom | Payload |
|-------|---------|---------|
| `room_history` | Joining user only | `{ messages: [...] }` |
| `receive_message` | Everyone in room | `{ id, userId, username, content, timestamp }` |
| `user_joined` | Everyone in room | `{ username, message }` |
| `user_left` | Everyone in room | `{ username, message }` |

---

### Phase 6 — Security and Tests

**Rate limiting:**
- Global: 100 requests per 15 minutes
- Auth routes: 10 requests per hour

**Tests to write** (using Jest + Supertest):

- [ ] `POST /api/auth/register` — creates user and returns token
- [ ] `POST /api/auth/login` — returns token for valid credentials
- [ ] `POST /api/auth/login` — returns 401 for wrong password
- [ ] `GET /api/products` — returns 200 and array
- [ ] `POST /api/products` — returns 401 without token
- [ ] `POST /api/products` — returns 400 with missing name
- [ ] `DELETE /api/products/:id` — returns 403 if not the owner

---

## Constraints

- All routes that touch the database use `asyncHandler` — no bare `try/catch` in route files
- All SQL uses parameterised queries — no string interpolation
- No hardcoded secrets — everything comes from `process.env`
- Logs use `logger.error()` for errors, `logger.info()` for events — no `console.log` in production code
- `app.js` never calls `.listen()` — only `index.js` does

---

## Stretch Goals

- Add pagination cursor (instead of offset) for messages — why is this better for chat?
- Add typing indicators: `user_typing` event that broadcasts for 3 seconds, then clears
- Add read receipts: track which messages each user has seen
- Implement refresh tokens: short-lived access token + long-lived refresh token
- Write a load test: how many concurrent Socket.io connections can your server handle?

---

## Self-Review Checklist

Before you consider this done:

**Security:**
- [ ] SQL injection impossible — all queries use `?` placeholders
- [ ] JWT secret is in `.env`, not in code
- [ ] Passwords are bcrypt hashed, never stored in plain text
- [ ] File uploads validate mimetype, not just extension
- [ ] Error handler returns generic messages when `NODE_ENV=production`

**Correctness:**
- [ ] Only product owners can update or delete their products
- [ ] Socket.io connections require a valid JWT
- [ ] Chat messages are persisted to the database
- [ ] Disconnecting broadcasts a `user_left` event

**Quality:**
- [ ] All tests pass with `npm test`
- [ ] `npm test` uses the test database, not production
- [ ] No `console.log` in route or socket files
- [ ] Morgan logs all HTTP requests

---

## How This Connects to Other Tracks

| This project | Connects to |
|-------------|------------|
| Auth routes | React track — the frontend calls these to log in |
| Products routes | React track — the product list and detail pages |
| Socket.io chat | React track — the `ChatRoom` component |
| MySQL schema | SQL track — the database you designed |
| REST API design | Python track — same patterns, different language |

When all three projects are running together (Python API, React frontend, Node.js chat backend), you have a full-stack application — three separate services sharing one database.
