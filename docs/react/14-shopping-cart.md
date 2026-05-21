---
sidebar_position: 15
---

# 14 — Shopping Cart Page

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** build a fully functional cart page with quantity controls, item removal, and an order total.

---

## The Hook

The cart is already managed in `CartContext`. This lesson builds the page that displays it — with controls to increase/decrease quantity, remove items, and see the total.

---

## Cart Page

Create `src/pages/CartPage.jsx`:

```jsx
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { orderService } from '../services/orderService'
import { useState } from 'react'

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate       = useNavigate()
  const [address,  setAddress]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')}>Shop Now</button>
      </div>
    )
  }

  async function handleCheckout() {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (!address.trim()) {
      setError('Please enter a shipping address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const items = cart.map(item => ({
        product_id: item.id,
        quantity:   item.quantity,
      }))

      const response = await orderService.placeOrder(address, items)
      clearCart()
      navigate(`/orders/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-items">
        {cart.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="cart-summary">
        <h2>Total: KES {total.toFixed(2)}</h2>

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Shipping address"
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleCheckout} disabled={loading}>
          {loading ? 'Placing order...' : 'Place Order'}
        </button>

        <button onClick={() => navigate('/products')} className="secondary">
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
```

---

## CartItem Component

Create `src/components/CartItem.jsx`:

```jsx
import { useCart } from '../context/CartContext'

export default function CartItem({ item }) {
  const { addToCart, removeFromCart } = useCart()

  function decrease() {
    if (item.quantity === 1) {
      removeFromCart(item.id)
    } else {
      addToCart({ ...item, quantity: -1 })
    }
  }

  return (
    <div className="cart-item">
      <div className="item-info">
        <h4>{item.name}</h4>
        <p>KES {item.price.toFixed(2)} each</p>
      </div>

      <div className="item-controls">
        <button onClick={decrease}>−</button>
        <span>{item.quantity}</span>
        <button onClick={() => addToCart(item)}>+</button>
      </div>

      <div className="item-subtotal">
        KES {(item.price * item.quantity).toFixed(2)}
      </div>

      <button
        className="remove-btn"
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </button>
    </div>
  )
}
```

---

## Update CartContext for Quantity Decrease

The current `addToCart` always increments. Update it to accept a quantity delta:

```jsx
function addToCart(product, delta = 1) {
  const existing = cart.find(item => item.id === product.id)
  if (existing) {
    const newQty = existing.quantity + delta
    if (newQty <= 0) {
      removeFromCart(product.id)
    } else {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: newQty } : item
      ))
    }
  } else {
    setCart([...cart, { ...product, quantity: delta }])
  }
}
```

---

## Add Cart Route

```jsx
// App.jsx
import CartPage from './pages/CartPage'

<Route path="/cart" element={<CartPage />} />
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Allowing quantity below 1 | Negative quantity in cart | Check `newQty <= 0` and remove the item |
| Sending product prices from frontend | Price manipulation attack | Always use the price from the database in the backend |
| Not clearing cart after successful order | Stale cart on next visit | Call `clearCart()` on successful order |

---

## Checkpoint

- [ ] Cart page shows all items with quantities and subtotals
- [ ] Quantity can be increased and decreased per item
- [ ] Item can be removed
- [ ] Empty cart shows a "Shop Now" button
- [ ] Checkout calls the API and navigates to order confirmation on success

---

**Next lesson:** [15 — Styling and Polish](./15-styling-and-polish)
