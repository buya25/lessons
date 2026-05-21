---
sidebar_position: 8
---

# 07 — useEffect and Data Fetching

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** run code after a component renders, fetch data from an API, and handle loading and error states.

---

## The Hook

Components render. But sometimes you need to do something **after** they render — fetch data from an API, set up a timer, subscribe to something.

`useEffect` is how you do that.

---

## useEffect Basics

```jsx
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    console.log('Component rendered')
  })

  return <div>Hello</div>
}
```

The function inside `useEffect` runs **after every render** by default.

---

## The Dependency Array

Control when the effect runs with the second argument:

```jsx
// Run after every render (usually not what you want)
useEffect(() => { ... })

// Run only once — when component first appears
useEffect(() => { ... }, [])

// Run when 'id' changes
useEffect(() => { ... }, [id])

// Run when 'id' or 'category' changes
useEffect(() => { ... }, [id, category])
```

**For fetching data on page load: use `[]`.**

---

## Fetching Data from the API

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load products')
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading products...</p>
  if (error)   return <p style={{ color: 'red' }}>{error}</p>

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name} — KES {product.price}
        </li>
      ))}
    </ul>
  )
}
```

Three states every data-fetching component needs: **loading**, **error**, **data**.  
Always handle all three — never just the happy path.

---

## Async / Await Version (Cleaner)

```jsx
useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/products')
      setProducts(response.data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  fetchProducts()
}, [])
```

Note: the `useEffect` callback itself cannot be `async` — define an async function inside and call it.

---

## Fetch When Something Changes

Fetch a single product when the ID in the URL changes:

```jsx
function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/products/${productId}`)
      setProduct(response.data)
      setLoading(false)
    }

    fetchProduct()
  }, [productId])  // re-runs whenever productId changes

  if (loading) return <p>Loading...</p>
  if (!product) return <p>Product not found</p>

  return <h2>{product.name}</h2>
}
```

---

## Cleanup — Avoiding Memory Leaks

If a component unmounts before a fetch completes, setting state on it causes a warning. Return a cleanup function:

```jsx
useEffect(() => {
  let cancelled = false

  async function fetchData() {
    const response = await axios.get('/api/products')
    if (!cancelled) setProducts(response.data)
  }

  fetchData()

  return () => { cancelled = true }  // cleanup
}, [])
```

---

## Predict Before You Run

```jsx
useEffect(() => {
  console.log('Effect ran')
}, [])

useEffect(() => {
  console.log('Count effect:', count)
}, [count])
```

If `count` starts at 0 and the user clicks "+1" twice, how many times does each log appear?

<details>
<summary>Answer</summary>

First effect: **1 time** — `[]` means run once only.  
Second effect: **3 times** — once on mount (count = 0), once for count = 1, once for count = 2.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| No dependency array | Fetch runs on every render → infinite loop | Always add `[]` for one-time fetches |
| Missing loading/error states | Blank screen or crash on slow/failed API | Handle all three states |
| `async` directly on `useEffect(() => async () => ...)` | React warning | Define async function inside, call it |
| Putting a function in deps without `useCallback` | Infinite re-render loop | Move stable functions outside the component or use `useCallback` |

---

## Checkpoint

- [ ] You fetched products from the Python API with `useEffect`
- [ ] You handled loading, error, and success states
- [ ] You used the async/await pattern inside useEffect
- [ ] You understand what the dependency array controls

---

**Next lesson:** [08 — Lists and Keys](./08-lists-and-keys)
