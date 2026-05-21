---
sidebar_position: 14
---

# 13 — Authentication Flow

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** implement login, register, logout, and protect routes so only authenticated users can access them.

---

## The Hook

Authentication is the most important feature in any app with users.  
Get it wrong and you expose private data, or block legitimate users.

This lesson wires up everything: AuthContext + login form + protected routes + token persistence.

---

## The Full Flow

```
1. User fills login form
2. React calls authService.login(email, password)
3. Python API returns a JWT token
4. React stores token in localStorage + AuthContext
5. All future API requests include the token (via axios interceptor)
6. Protected routes check AuthContext — redirect to /login if no token
7. On logout: clear token from localStorage + AuthContext
```

---

## Login Page

Create `src/pages/LoginPage.jsx`:

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { token } = await authService.login(form.email, form.password)
      login({ email: form.email }, token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  )
}
```

---

## Register Page

Create `src/pages/RegisterPage.jsx`:

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'

export default function RegisterPage() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await authService.register(form.name, form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <input name="name"     value={form.name}     onChange={handleChange} placeholder="Full name" required />
        <input name="email"    value={form.email}    onChange={handleChange} placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}
```

---

## Update Navbar with Auth State

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth()
  const { cart }               = useCart()
  const navigate               = useNavigate()
  const itemCount = cart.reduce((n, item) => n + item.quantity, 0)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Store</Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({itemCount})</Link>
        {isLoggedIn
          ? <button onClick={handleLogout}>Logout</button>
          : <Link to="/login">Login</Link>
        }
      </div>
    </nav>
  )
}
```

---

## Add Routes for Register

```jsx
// App.jsx
import RegisterPage from './pages/RegisterPage'

<Route path="/register" element={<RegisterPage />} />
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Storing token in component state only | Token gone on page refresh | Store in localStorage via AuthContext |
| Showing specific error: "wrong password" | Helps attackers know which field is wrong | Always show generic "Invalid credentials" |
| No `disabled` on submit button during loading | User submits twice | Disable button while `loading` is true |
| No error display from API response | User gets no feedback | Show `err.response?.data?.error` |

---

## Checkpoint

- [ ] Login page calls the API and stores the token
- [ ] Register page creates an account and redirects to login
- [ ] Navbar shows Login when logged out, Logout button when logged in
- [ ] Protected routes redirect to `/login` when no token exists
- [ ] Refreshing the page keeps the user logged in (localStorage)

---

**Next lesson:** [14 — Shopping Cart Page](./14-shopping-cart)
