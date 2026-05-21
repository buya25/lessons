---
sidebar_position: 6
---

# 05 — State with useState

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** add state to a component, update it, and understand why React re-renders when state changes.

---

## The Hook

Props come from outside. **State** lives inside a component.

When you click "Add to Cart", the cart count goes up. That changing number is **state** — data that belongs to a component and changes over time.

Every time state changes, React re-renders the component with the new value. Automatically. You just change the state.

---

## useState

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

`useState(0)` — `0` is the initial value.  
`[count, setCount]` — `count` is the current value, `setCount` is the function to change it.  
Call `setCount(newValue)` — React updates `count` and re-renders the component.

**Never** do `count = count + 1` — direct assignment does not trigger a re-render.

---

## Multiple State Variables

```jsx
function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)

  return (
    <form>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
```

`e.target.value` — the current value of the input field.

---

## State With Objects

```jsx
const [product, setProduct] = useState({
  name: '',
  price: 0,
  stock: 0,
})

// Update one field — spread the rest to keep them
setProduct({ ...product, price: 150 })
```

**Never mutate state directly:**
```jsx
// Wrong — React will not detect the change
product.price = 150
setProduct(product)

// Correct — new object
setProduct({ ...product, price: 150 })
```

---

## State With Arrays

```jsx
const [cart, setCart] = useState([])

// Add item
setCart([...cart, newItem])

// Remove item
setCart(cart.filter(item => item.id !== removeId))

// Update item
setCart(cart.map(item =>
  item.id === updateId ? { ...item, quantity: item.quantity + 1 } : item
))
```

---

## Build It — Cart Counter

Create `src/components/CartButton.jsx`:

```jsx
import { useState } from 'react'

function CartButton() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Cart ({count})
    </button>
  )
}

export default CartButton
```

Add it to `App.jsx` and click it — the number goes up each time.

---

## Predict Before You Run

```jsx
const [items, setItems] = useState(['a', 'b', 'c'])

// What is items after each call?
setItems([...items, 'd'])
setItems(items.filter(i => i !== 'b'))
setItems(items.map(i => i.toUpperCase()))
```

<details>
<summary>Answers</summary>

1. `['a', 'b', 'c', 'd']`
2. `['a', 'c']`
3. `['A', 'B', 'C']`

Note: each line starts from the original `['a', 'b', 'c']` — state updates in React are queued, not chained in a single render.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `count = count + 1` | No re-render | Use `setCount(count + 1)` |
| `setProduct(product.price = 150)` | Mutation, unreliable | Spread: `setProduct({...product, price: 150})` |
| Using state for data that does not change | Unnecessary re-renders | Use a regular variable or prop instead |
| Calling state setter inside render (not in an event) | Infinite loop | Only call setters in event handlers or effects |

---

## When Things Go Wrong

**UI not updating after state change**  
You are mutating state directly. Always return a new value — new array, new object.

**Infinite re-render loop**  
You called a state setter directly in the component body (outside a handler). Move it inside a `useEffect` or event handler.

---

## Checkpoint

- [ ] You created a counter that increments on button click
- [ ] You controlled an input field with state
- [ ] You added and removed items from a state array
- [ ] You understand why direct mutation does not work

---

**Next lesson:** [06 — Events and Forms](./06-events-and-forms)
