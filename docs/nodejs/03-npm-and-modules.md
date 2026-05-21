---
sidebar_position: 4
---

# 03 — npm and Modules

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** initialise a Node project, install packages, use CommonJS and ES modules, and understand `package.json`.

---

## The Hook

npm (Node Package Manager) is the world's largest software registry — over 2 million packages.  
Anything you need — web framework, database driver, date library, email sender — is one command away.

---

## Initialise a Project

```bash
mkdir chat-app
cd chat-app
npm init -y
```

`-y` accepts all defaults. This creates `package.json`:

```json
{
  "name": "chat-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

## Installing Packages

```bash
npm install express           # installs + adds to dependencies
npm install --save-dev nodemon  # dev-only dependency
npm install express socket.io mysql2 dotenv  # install multiple at once
```

After installing, `package.json` gains:
```json
"dependencies": {
  "express": "^4.18.2",
  "socket.io": "^4.7.2"
},
"devDependencies": {
  "nodemon": "^3.0.1"
}
```

`node_modules/` is created — **never commit this to git**.  
Add it to `.gitignore`:
```
node_modules/
.env
```

Anyone cloning the repo runs `npm install` to restore it.

---

## CommonJS vs ES Modules

Node.js supports two module systems:

**CommonJS (older, still common):**
```javascript
const express = require('express')
const { readFile } = require('fs')
module.exports = { myFunction }
```

**ES Modules (modern, same as browser/React):**
```javascript
import express from 'express'
import { readFile } from 'fs'
export function myFunction() {}
export default myFunction
```

To use ES modules in Node, either:
- Name your files `.mjs`, or
- Add `"type": "module"` to `package.json`

**We will use ES modules** — consistent with React and modern JavaScript.

Add to `package.json`:
```json
{
  "type": "module"
}
```

---

## npm Scripts — Shortcuts

Add scripts to `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev":   "nodemon index.js",
  "test":  "jest"
}
```

Run them:
```bash
npm start        # node index.js
npm run dev      # nodemon index.js (auto-restarts on file change)
npm test         # jest
```

**nodemon** watches your files and restarts the server automatically when you save — essential for development.

---

## Useful Built-in Modules

```javascript
import path from 'path'
import fs   from 'fs'
import os   from 'os'
import url  from 'url'

// __dirname equivalent in ES modules
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
```

---

## The package-lock.json

`package-lock.json` records the exact version of every installed package.  
**Always commit it** — it ensures everyone on your team installs the same versions.

---

## Predict Before You Run

After running `npm install express`, which of these files should you commit to git?

- `node_modules/express/index.js`
- `package.json`
- `package-lock.json`
- `.env`

<details>
<summary>Answer</summary>

Commit: `package.json` and `package-lock.json`  
Do NOT commit: `node_modules/` (too large, regenerated with `npm install`) and `.env` (contains secrets)

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Committing `node_modules/` | Massive repo, version conflicts | Add to `.gitignore` immediately |
| `require()` with `"type":"module"` | `SyntaxError` | Use `import` or remove `"type":"module"` |
| Committing `.env` | Credentials exposed on GitHub | Add `.env` to `.gitignore` |

---

## Checkpoint

- [ ] `chat-app/` project initialised with `npm init -y`
- [ ] Express, socket.io, mysql2, dotenv installed
- [ ] nodemon installed as a dev dependency
- [ ] `"type": "module"` added to `package.json`
- [ ] `node_modules/` and `.env` in `.gitignore`
- [ ] `npm run dev` script added

---

**Next lesson:** [04 — Express Basics](./04-express-basics)
