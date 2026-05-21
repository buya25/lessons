---
sidebar_position: 3
---

# 02 — Your First Server

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** create an HTTP server with Node's built-in module and understand how requests and responses work.

---

## The Hook

Every website, API, and chat app starts the same way — a server listening for incoming connections.

Before using Express (which simplifies everything), let's see what a server looks like at the lowest level. Understanding the foundation makes the framework make sense.

---

## The Built-in http Module

Node.js ships with an `http` module — no installation needed:

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello, World!')
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

Run it:
```bash
node server.js
```

Open `http://localhost:3000` — you see "Hello, World!".

---

## The Request and Response Objects

Every incoming request triggers the callback with two objects:

**`req` (IncomingMessage):**
```javascript
req.method    // 'GET', 'POST', 'PUT', 'DELETE'
req.url       // '/products', '/login', etc.
req.headers   // { 'content-type': 'application/json', ... }
```

**`res` (ServerResponse):**
```javascript
res.writeHead(statusCode, headers)  // set status + headers
res.write(data)                     // write part of the body
res.end(data)                       // finish the response
```

---

## Routing by URL

```javascript
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Home page')

  } else if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('About page')

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
  }
})
```

This works — but it gets messy fast. This is exactly why Express exists.

---

## Returning JSON

```javascript
const server = http.createServer((req, res) => {
  if (req.url === '/api/products') {
    const products = [
      { id: 1, name: 'Notebook', price: 150 },
      { id: 2, name: 'Pen',      price: 20  },
    ]
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(products))
  }
})
```

---

## Reading a POST Body

Request bodies arrive in **chunks** — you have to collect them:

```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/echo') {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      const data = JSON.parse(body)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ received: data }))
    })
  }
})
```

Again — Express handles this automatically. But now you understand what it is doing.

---

## Predict Before You Run

```javascript
const server = http.createServer((req, res) => {
  console.log(req.method, req.url)
  res.end('ok')
})
server.listen(3000)
```

If you open `http://localhost:3000/products` in a browser, what does the console show?

<details>
<summary>Answer</summary>

```
GET /products
GET /favicon.ico
```

Browsers automatically request a favicon — you will see two log entries, not one.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Calling `res.end()` twice | Error: `write after end` | Only call `res.end()` once per request |
| Forgetting `Content-Type` header | Browser renders raw text | Always set the correct content type |
| Not calling `res.end()` at all | Request hangs forever | Always end every response |

---

## When Things Go Wrong

**`EADDRINUSE: address already in use`**  
Another process is using port 3000. Either stop it or change the port: `server.listen(3001)`.

**`Cannot set headers after they are sent`**  
You called `res.writeHead()` or `res.end()` more than once. Trace your code path to find the duplicate.

---

## Checkpoint

- [ ] You created an HTTP server and opened it in the browser
- [ ] You returned different responses based on `req.url`
- [ ] You returned JSON with the correct Content-Type header
- [ ] You understand why raw Node.js HTTP is verbose and why Express is needed

---

**Next lesson:** [03 — npm and Modules](./03-npm-and-modules)
