---
sidebar_position: 1
---

# Node.js Track

**Estimated time per lesson:** ~20 minutes  
**After this track, you will be able to:** build a production-ready REST API with Express, handle real-time communication with Socket.io, connect to MySQL, and deploy your backend with confidence.

---

## Prerequisites

Complete the **[React](../react/intro)** track first — you need to be comfortable with JavaScript (async/await, modules, arrow functions) before writing backend code.

---

## What You Will Build

A **real-time chat and e-commerce API**:
- User registration and JWT authentication
- Products CRUD with image uploads
- Live chat rooms using WebSockets
- Rate limiting, security headers, and input validation
- Tests with Jest and Supertest
- Structured logging for production

This backend connects to the same MySQL database from the SQL track and is consumed by the React frontend you built in the React track.

---

## Lessons

| # | Lesson | What you learn |
|---|--------|---------------|
| 01 | [What is Node.js](./01-what-is-nodejs) | Event loop, Node vs browser |
| 02 | [Your First Server](./02-your-first-server) | Raw HTTP module |
| 03 | [npm and Modules](./03-npm-and-modules) | package.json, ES modules, nodemon |
| 04 | [Express Basics](./04-express-basics) | Routes, params, body, query |
| 05 | [Middleware](./05-middleware) | Logger, CORS, auth, error handler |
| 06 | [Express Router](./06-express-router) | Route files, project structure |
| 07 | [Connecting to MySQL](./07-connecting-to-mysql) | mysql2 pool, query helper, transactions |
| 08 | [Async/Await](./08-async-await) | Callbacks → Promises → async/await |
| 09 | [File Uploads](./09-file-uploads) | Multer, validation, disk storage |
| 10 | [WebSockets with Socket.io](./10-websockets-socketio) | Rooms, events, React client |
| 11 | [Rate Limiting and Security](./11-rate-limiting-and-security) | express-rate-limit, helmet, express-validator |
| 12 | [Testing with Jest](./12-testing-with-jest) | Unit tests, integration tests, Supertest |
| 13 | [Environment and Deployment Prep](./13-environment-and-deployment) | .env, config validation, NODE_ENV |
| 14 | [Logging and Debugging](./14-logging-and-debugging) | morgan, winston, reading stack traces |
| 15 | [Project Walkthrough](./15-project-walkthrough) | How all pieces connect |

---

## Capstone Project

[Real-Time Chat API](./project-realtime-chat) — build the complete backend from scratch.
