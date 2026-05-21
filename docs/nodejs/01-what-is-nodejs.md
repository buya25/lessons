---
sidebar_position: 2
---

# 01 — What is Node.js?

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain what Node.js is, how it differs from Python, and why it is used for real-time applications.

---

## The Hook

JavaScript was born in the browser — it ran nowhere else.  
In 2009, Node.js changed that. Now JavaScript runs on servers, builds APIs, handles files, and powers real-time apps.

You already know JavaScript from the React track.  
Node.js is the same language — running outside the browser.

---

## What Node.js Is

Node.js is a **runtime** — it takes JavaScript code and executes it on your machine or server, without a browser.

Under the hood it uses Chrome's V8 engine (the same one that runs JS in Chrome) plus a library called **libuv** that handles file I/O, networking, and the event loop.

---

## How Node.js Differs from Python

| | Node.js | Python (Flask) |
|--|---------|---------------|
| Language | JavaScript | Python |
| Concurrency model | Event loop (non-blocking) | Thread-based |
| Best for | Real-time, high-concurrency | Data processing, scripting, ML |
| Package manager | npm | pip |
| Config files | `package.json` | `requirements.txt` |

Neither is better — they solve different problems. Node excels when many clients connect simultaneously (chat, notifications, live updates).

---

## The Event Loop — Why Node is Fast

Python Flask handles one request at a time per thread.  
Node.js handles thousands of requests on a single thread using the **event loop**.

When Node starts a slow operation (reading a file, querying a database), it does not wait — it registers a callback and moves on to the next request. When the operation finishes, the callback runs.

```javascript
// This does NOT block — Node moves on immediately
readFile('data.txt', (err, data) => {
  // This runs when the file is ready
  console.log(data)
})
console.log('This runs before the file is read')
```

Output:
```
This runs before the file is read
[file contents]
```

This is why Node.js can handle 10,000 simultaneous chat connections on a single server.

---

## What We Will Build

A **real-time chat application** — users can join rooms and send messages that appear instantly for everyone in the room, without refreshing the page.

This uses **Socket.io** — a library built on top of WebSockets that Node.js handles perfectly.

---

## Verify Your Setup

```bash
node --version    # should be 18+ 
npm --version
```

Run your first Node.js program. Create `hello.js`:

```javascript
console.log('Hello from Node.js')
console.log('Node version:', process.version)
console.log('Platform:', process.platform)
```

Run it:
```bash
node hello.js
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Expecting `window` or `document` to exist | Those are browser APIs — they don't exist in Node |
| Using `require()` in React and `import` in Node or vice versa | Modern Node uses ES modules (`import`) — we'll cover this in lesson 03 |
| Thinking Node is only for JavaScript developers | Node is a runtime, not a language preference — many Python devs use it for specific tasks |

---

## Checkpoint

- [ ] You can explain what Node.js is and how it differs from a browser
- [ ] `node --version` returns 18 or higher
- [ ] You ran `hello.js` and saw the output
- [ ] You understand what the event loop means in plain English

---

**Next lesson:** [02 — Your First Server](./02-your-first-server)
