---
sidebar_position: 9
---

# 08 — Lists and Keys

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** render arrays of data as lists of components and understand why keys are required.

---

## The Hook

Your API returns 50 products. You need to render all 50 as cards.  
Writing 50 `<ProductCard />` components by hand is not an option.

`.map()` renders a list from an array — and it is the most-used pattern in all of React.

---

## Rendering a List

```jsx
const products = [
  { id: 1, name: 'Notebook', price: 150 },
  { id: 2, name: 'Pen',      price: 20  },
  { id: 3, name: 'Backpack', price: 850 },
]

function ProductList() {
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

---

## Why Keys Are Required

When React updates a list, it needs to know **which item changed** to avoid re-rendering everything.  
The `key` prop is how React tracks each item.

```jsx
// Wrong — no key
{products.map(product => <li>{product.name}</li>)}

// Wrong — index as key (causes bugs when list reorders)
{products.map((product, index) => <li key={index}>{product.name}</li>)}

// Correct — unique stable ID
{products.map(product => <li key={product.id}>{product.name}</li>)}
```

**Rules:**
- Keys must be unique among siblings
- Keys must be stable — do not use `Math.random()`
- Use the item's database `id` — it is already unique and stable
- Keys are not accessible as props in the child — they are internal to React

---

## Rendering Components in a List

```jsx
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
        />
      ))}
    </div>
  )
}
```

Or pass the whole object as a prop:

```jsx
{products.map(product => (
  <ProductCard key={product.id} product={product} />
))}

// In ProductCard:
function ProductCard({ product }) {
  return <div>{product.name}</div>
}
```

---

## Empty States

Always handle the case where the list is empty:

```jsx
function ProductList({ products }) {
  if (products.length === 0) {
    return <p>No products found.</p>
  }

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

## Filtering and Sorting Before Rendering

```jsx
function ProductList({ products, searchQuery, sortBy }) {
  const displayed = products
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return a.name.localeCompare(b.name)
    })

  return (
    <div>
      {displayed.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

Transform the data before passing it to `.map()` — keep rendering logic clean.

---

## Predict Before You Run

```jsx
const items = ['a', 'b', 'c']

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item.toUpperCase()}</li>
    ))}
  </ul>
)
```

What renders? What is the problem with this code?

<details>
<summary>Answer</summary>

Renders:
```
• A
• B
• C
```

The problem: `key={index}` is fragile. If items reorder (`['b', 'a', 'c']`), React associates the wrong DOM node with the wrong key, causing incorrect updates. Always use a stable unique ID when available.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| No `key` prop | React warning, possible bugs | Add `key={item.id}` |
| `key={index}` on a reorderable list | Bugs when items reorder | Use a unique stable ID |
| Putting `key` on the wrong element | Warning ignored | `key` must be on the outermost element returned from `.map()` |
| No empty state | Blank space when list is empty | Always add a "no results" message |

---

## Checkpoint

- [ ] You rendered a list of products with `.map()`
- [ ] You used `key={product.id}` on every item
- [ ] You handled the empty list case
- [ ] You filtered and sorted before rendering

---

**Next lesson:** [09 — React Router](./09-react-router)
