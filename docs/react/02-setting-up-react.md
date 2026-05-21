---
sidebar_position: 3
---

# 02 — Setting Up React

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** create a new React project with Vite, understand the project structure, and run the development server.

---

## The Hook

There is no "download React and open index.html".  
React projects are built with a toolchain — a set of tools that bundle your code, handle imports, and run a live development server.

We will use **Vite** — the fastest and most modern way to start a React project.

---

## Create a New Project

Open a terminal in the folder where you want to create your project:

```bash
npm create vite@latest ecommerce-frontend -- --template react
cd ecommerce-frontend
npm install
npm run dev
```

Open `http://localhost:5173` — you should see the default Vite + React welcome page.

---

## The Project Structure

```
ecommerce-frontend/
├── public/              ← static files (favicon, images)
├── src/
│   ├── assets/          ← images, fonts used in code
│   ├── App.jsx          ← root component
│   ├── App.css          ← styles for App
│   ├── main.jsx         ← entry point — mounts App into index.html
│   └── index.css        ← global styles
├── index.html           ← single HTML file React injects into
├── package.json
└── vite.config.js
```

**The key files:**

`main.jsx` — starts everything:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

`App.jsx` — your root component. Everything visible starts here.

---

## Clean Up the Default Code

Delete the default content and start fresh.

Replace `src/App.jsx` with:
```jsx
function App() {
  return (
    <div>
      <h1>E-commerce Store</h1>
    </div>
  )
}

export default App
```

Replace `src/index.css` with:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  background: #f5f5f5;
}
```

Delete `src/App.css` and `src/assets/react.svg`.

The page now shows just "E-commerce Store". Clean starting point.

---

## Install Key Dependencies

```bash
npm install react-router-dom axios
```

- `react-router-dom` — handles navigation between pages
- `axios` — makes HTTP requests to the Python API

---

## The src/ Folder Structure We Will Build

```
src/
├── components/      ← reusable UI pieces (Button, Card, Navbar)
├── pages/           ← full pages (Home, Login, ProductDetail)
├── context/         ← global state (cart, auth)
├── hooks/           ← custom hooks
├── services/        ← API calls
├── App.jsx
└── main.jsx
```

Create these folders now:

```bash
mkdir src/components src/pages src/context src/hooks src/services
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using `create-react-app` | It is slow and deprecated — use Vite |
| `.js` instead of `.jsx` for component files | Use `.jsx` for files that contain JSX |
| Editing files in `public/` for app code | Code goes in `src/`, `public/` is for static assets |

---

## When Things Go Wrong

**`npm: command not found`**  
Node.js is not installed. Follow the [Setup guide](../setup/intro).

**Port 5173 already in use**  
Vite will automatically try the next port — check the terminal output for the actual URL.

**Changes not showing in browser**  
Vite has hot reload — save the file and changes appear automatically. If not, check the terminal for errors.

---

## Checkpoint

- [ ] Vite + React project created and running at localhost:5173
- [ ] Default content replaced with clean starting App.jsx
- [ ] `react-router-dom` and `axios` installed
- [ ] Folder structure (`components/`, `pages/`, etc.) created

---

**Next lesson:** [03 — JSX and Components](./03-jsx-and-components)
