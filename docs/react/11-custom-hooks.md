---
sidebar_position: 12
---

# 11 — Custom Hooks

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** extract repeated logic into custom hooks and reuse it across multiple components.

---

## The Hook

You wrote the same fetch + loading + error logic in three different components.  
A **custom hook** extracts that logic into one reusable function.

Custom hooks are just functions that start with `use` and can call other hooks inside them.

---

## The Problem

You are copying this pattern everywhere:

```jsx
const [data,    setData]    = useState(null)
const [loading, setLoading] = useState(true)
const [error,   setError]   = useState(null)

useEffect(() => {
  axios.get(url).then(res => {
    setData(res.data)
    setLoading(false)
  }).catch(err => {
    setError(err.message)
    setLoading(false)
  })
}, [url])
```

---

## The Solution — useFetch

Create `src/hooks/useFetch.js`:

```javascript
import { useState, useEffect } from 'react'
import axios from 'axios'

export function useFetch(url) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        setLoading(true)
        const response = await axios.get(url)
        if (!cancelled) {
          setData(response.data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}
```

---

## Using It

```jsx
import { useFetch } from '../hooks/useFetch'

function ProductsPage() {
  const { data: products, loading, error } = useFetch('http://localhost:5000/api/products')

  if (loading) return <p>Loading...</p>
  if (error)   return <p>Error: {error}</p>

  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

Three lines instead of fifteen. Use the same hook in every component that fetches data.

---

## useLocalStorage Hook

Create `src/hooks/useLocalStorage.js`:

```javascript
import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  function setStoredValue(newValue) {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue]
}
```

Use it like `useState` but it persists across page reloads:

```jsx
const [theme, setTheme] = useLocalStorage('theme', 'light')
const [cart,  setCart]  = useLocalStorage('cart', [])
```

---

## useDebounce Hook — For Search

Prevent an API call on every single keystroke:

```javascript
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
```

```jsx
const [query, setQuery] = useState('')
const debouncedQuery    = useDebounce(query, 400)

// Only re-fetches when user stops typing for 400ms
const { data } = useFetch(`/api/products?search=${debouncedQuery}`)
```

---

## Rules of Hooks

All hooks — built-in and custom — follow the same rules:

1. **Only call hooks at the top level** — not inside loops, conditions, or nested functions
2. **Only call hooks inside React functions** — components or other custom hooks
3. **Custom hook names must start with `use`** — so React can enforce the rules

---

## Predict Before You Run

```jsx
function ProductsPage() {
  const { data, loading } = useFetch('/api/products')

  if (loading) return <p>Loading...</p>

  // Can you call another hook here?
  const [selected, setSelected] = useState(null)  // ← is this valid?
}
```

<details>
<summary>Answer</summary>

**No — this breaks the rules of hooks.**

Hooks must be called unconditionally at the top level. The early `return` means `useState` is only called when `loading` is false, making the hook call conditional.

Fix: move `useState` to the top before any conditional returns.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Hook name without `use` prefix | React does not apply hook rules | Always prefix with `use` |
| Calling hook inside a condition | `Hooks can only be called...` error | Move to top level |
| Returning JSX from a custom hook | Not a React pattern | Hooks return data, not UI |

---

## Checkpoint

- [ ] You created `useFetch` and replaced manual fetch logic in at least 2 components
- [ ] You created `useLocalStorage` and persisted a value across page reloads
- [ ] You created `useDebounce` and used it on a search input
- [ ] You understand the rules of hooks

---

**Next lesson:** [12 — API Service Layer](./12-api-service-layer)
