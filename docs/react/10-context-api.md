---
sidebar_position: 11
---

# 10 — Context API

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** share state across multiple components without prop drilling using React Context.

---

## The Hook

The cart count shows in the Navbar. The cart data is managed in App.  
Every component in between has to pass it down as a prop — even if they don't use it.

This is called **prop drilling** and it makes code messy fast.

**Context** solves this — any component can access the data directly, no matter how deep.

---

## The Problem (Prop Drilling)

```
App (has cartCount)
 └── Navbar (needs cartCount — must receive it as prop)
      └── CartIcon (needs cartCount — must receive it as prop)
           └── CartBadge (finally uses it)
```

With Context:
```
App
 └── CartProvider (holds cartCount)
      └── Navbar
           └── CartIcon
                └── CartBadge (reads cartCount directly from context)
```

---

## Creating a Context

Create `src/context/CartContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  function removeFromCart(productId) {
    setCart(cart.filter(item => item.id !== productId))
  }

  function clearCart() {
    setCart([])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
```

---

## Wrap Your App in the Provider

```jsx
// main.jsx
import { CartProvider } from './context/CartContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
)
```

---

## Use the Context Anywhere

**In ProductCard:**
```jsx
import { useCart } from '../context/CartContext'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div>
      <h3>{product.name}</h3>
      <p>KES {product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  )
}
```

**In Navbar:**
```jsx
import { useCart } from '../context/CartContext'

function Navbar() {
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart ({itemCount})</Link>
    </nav>
  )
}
```

No prop passing. Both components access the cart directly.

---

## Auth Context

Create `src/context/AuthContext.jsx` — you will need this for login:

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  function login(userData, authToken) {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('token', authToken)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

---

## Predict Before You Run

If `CartProvider` is placed inside `<Routes>` instead of wrapping the whole app, what happens when a user navigates to a new page?

<details>
<summary>Answer</summary>

The cart empties on every navigation. The provider unmounts and remounts with each route change, resetting all state to the initial value.

Providers that hold global state must wrap the entire app — outside of `<Routes>`.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Using `useCart()` outside of `<CartProvider>` | Error or null context | Wrap the app in the provider |
| One giant context for everything | Every component re-renders when anything changes | Split into separate contexts: auth, cart, theme |
| Storing derived values in context | Stale data | Compute them from the raw state (`total`, `itemCount`) |

---

## Checkpoint

- [ ] `CartContext` is created and provides `cart`, `addToCart`, `removeFromCart`, `total`
- [ ] `CartProvider` wraps the app in `main.jsx`
- [ ] `ProductCard` adds items to cart without receiving any cart props
- [ ] `Navbar` shows the cart item count from context
- [ ] `AuthContext` is created with `login` and `logout` functions

---

**Next lesson:** [11 — Custom Hooks](./11-custom-hooks)
