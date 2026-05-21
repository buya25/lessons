---
sidebar_position: 10
---

# 09 — React Router

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** set up client-side navigation, create multiple pages, link between them, and read URL parameters.

---

## The Hook

A real app has multiple pages — Home, Products, Product Detail, Login, Cart.  
React Router handles navigation without reloading the page.

---

## Setup

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

---

## Define Routes

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom'
import HomePage        from './pages/HomePage'
import ProductsPage    from './pages/ProductsPage'
import ProductDetail   from './pages/ProductDetail'
import LoginPage       from './pages/LoginPage'
import NotFoundPage    from './pages/NotFoundPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"             element={<HomePage />}      />
        <Route path="/products"     element={<ProductsPage />}  />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login"        element={<LoginPage />}     />
        <Route path="*"             element={<NotFoundPage />}  />
      </Routes>
    </>
  )
}
```

`path="*"` catches all unmatched routes — the 404 page.

---

## Link — Navigate Without Reload

```jsx
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/login">Login</Link>
    </nav>
  )
}
```

Never use `<a href="/products">` for internal links — it causes a full page reload.  
Always use `<Link to="/products">`.

---

## URL Parameters

Read the `:id` from the URL:

```jsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
  }, [id])

  if (!product) return <p>Loading...</p>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>KES {product.price}</p>
    </div>
  )
}
```

---

## Programmatic Navigation

Navigate in code — after login, after form submit:

```jsx
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin() {
    // ... login logic
    navigate('/')           // go to home
    navigate(-1)            // go back
    navigate('/dashboard', { replace: true })  // replace history entry
  }
}
```

---

## Active Links

Style the current page's link differently:

```jsx
import { NavLink } from 'react-router-dom'

<NavLink
  to="/products"
  className={({ isActive }) => isActive ? 'active-link' : ''}
>
  Products
</NavLink>
```

---

## Protected Routes

Redirect users who are not logged in:

```jsx
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

// In App.jsx:
<Route path="/orders" element={
  <ProtectedRoute>
    <OrdersPage />
  </ProtectedRoute>
} />
```

---

## Create the Pages

Create these files (bare minimum for now):

```jsx
// src/pages/HomePage.jsx
export default function HomePage() {
  return <h1>Welcome to the Store</h1>
}

// src/pages/ProductsPage.jsx
export default function ProductsPage() {
  return <h1>All Products</h1>
}

// src/pages/LoginPage.jsx
export default function LoginPage() {
  return <h1>Login</h1>
}

// src/pages/NotFoundPage.jsx
export default function NotFoundPage() {
  return <h1>404 — Page Not Found</h1>
}
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `<a href="/products">` for internal links | Full page reload | Use `<Link to="/products">` |
| Forgetting `<BrowserRouter>` in main.jsx | Crash | Wrap the entire app in `<BrowserRouter>` |
| `useParams()` outside a Route | Returns empty object | Only use inside a component rendered by a Route |

---

## Checkpoint

- [ ] You defined routes for at least 4 pages
- [ ] Navigation with `<Link>` works without page reload
- [ ] `useParams()` reads `:id` from the URL
- [ ] You set up a protected route that redirects unauthenticated users
- [ ] The 404 page catches unmatched routes

---

**Next lesson:** [10 — Context API](./10-context-api)
