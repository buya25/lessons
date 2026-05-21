---
sidebar_position: 7
---

# 06 — Events and Forms

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** handle user interactions, build controlled forms, and prevent default browser behaviour.

---

## The Hook

Every button click, keystroke, and form submission is an **event**.  
React gives you a consistent way to handle all of them.

---

## Handling Events

```jsx
function Button() {
  function handleClick() {
    console.log('clicked')
  }

  return <button onClick={handleClick}>Click me</button>
}
```

Pass the function reference — **do not call it**:

```jsx
// Correct — passes the function
<button onClick={handleClick}>

// Wrong — calls immediately on render
<button onClick={handleClick()}>
```

Inline arrow function (when you need to pass arguments):

```jsx
<button onClick={() => handleDelete(product.id)}>Delete</button>
```

---

## Common Events

| Event | When it fires |
|-------|--------------|
| `onClick` | Mouse click |
| `onChange` | Input value changes |
| `onSubmit` | Form submitted |
| `onKeyDown` | Key pressed |
| `onFocus` / `onBlur` | Input gains / loses focus |
| `onMouseEnter` / `onMouseLeave` | Hover |

---

## The Event Object

Every handler receives an event object `e`:

```jsx
function handleInput(e) {
  console.log(e.target.value)   // current input value
  console.log(e.target.name)    // input's name attribute
  console.log(e.type)           // "change", "click", etc.
}

<input onChange={handleInput} />
```

---

## Controlled Forms

In React, form inputs are **controlled** — their value is driven by state:

```jsx
import { useState } from 'react'

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()  // stop browser from reloading the page

    if (!form.email || !form.password) {
      setError('Both fields are required')
      return
    }

    console.log('Submitting:', form)
    setError('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}
```

`[e.target.name]: e.target.value` — computed property key. When `name="email"`, this sets `form.email`. One handler for all fields.

`e.preventDefault()` — stops the browser from reloading the page on form submit. **Always call this** in `onSubmit`.

---

## Build It — Product Search

Create a search input that filters products as you type:

```jsx
import { useState } from 'react'

const ALL_PRODUCTS = [
  { id: 1, name: 'Notebook', price: 150 },
  { id: 2, name: 'Pen',      price: 20  },
  { id: 3, name: 'Backpack', price: 850 },
]

function ProductSearch() {
  const [query, setQuery] = useState('')

  const filtered = ALL_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <ul>
        {filtered.map(p => (
          <li key={p.id}>{p.name} — KES {p.price}</li>
        ))}
      </ul>
    </div>
  )
}
```

Type in the search box — the list updates live with every keystroke.

---

## Predict Before You Run

```jsx
const [count, setCount] = useState(0)

<button onClick={() => {
  setCount(count + 1)
  setCount(count + 1)
}}>
  +2?
</button>
```

Does clicking add 1 or 2?

<details>
<summary>Answer</summary>

**1** — not 2.

Both `setCount` calls use the same `count` value from this render. To reliably add 2, use the functional update form:

```jsx
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

This guarantees each update builds on the previous one.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `onClick={handleClick()}` | Runs on render, not on click | Remove `()`: `onClick={handleClick}` |
| Forgetting `e.preventDefault()` in form | Page reloads on submit | Always add it as first line of `onSubmit` |
| Not controlling input with state | Can't read input value reliably | Always pair `value` + `onChange` |

---

## Checkpoint

- [ ] You handled a button click and logged the result
- [ ] You built a controlled form with a single `handleChange` for all fields
- [ ] You prevented default form submission
- [ ] You built the live product search
- [ ] You understand the functional update pattern for state

---

**Next lesson:** [07 — useEffect and Data Fetching](./07-useeffect-and-data-fetching)
