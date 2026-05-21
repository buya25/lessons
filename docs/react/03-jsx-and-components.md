---
sidebar_position: 4
---

# 03 — JSX and Components

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** write JSX, create functional components, and compose them together.

---

## The Hook

React components look like HTML but they are JavaScript.  
This combination is called **JSX** — and once you understand the rules, it feels completely natural.

---

## What is JSX?

JSX lets you write HTML-like syntax inside JavaScript:

```jsx
function Greeting() {
  return <h1>Hello, World!</h1>
}
```

This is NOT HTML. Under the hood, React converts it to:

```javascript
React.createElement('h1', null, 'Hello, World!')
```

You write JSX because it is readable. React handles the conversion.

---

## JSX Rules

**1. Return one root element:**
```jsx
// Wrong — two root elements
return (
  <h1>Title</h1>
  <p>Text</p>
)

// Correct — wrapped in one element
return (
  <div>
    <h1>Title</h1>
    <p>Text</p>
  </div>
)

// Also correct — empty wrapper (Fragment) adds no HTML
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
)
```

**2. Use `className` not `class`:**
```jsx
<div className="card">...</div>
```

**3. Self-close tags that have no children:**
```jsx
<img src="photo.jpg" alt="product" />
<input type="text" />
```

**4. JavaScript inside curly braces `{}`:**
```jsx
const name = "Alice"
return <h1>Hello, {name}</h1>
```

---

## Your First Component

Create `src/components/ProductCard.jsx`:

```jsx
function ProductCard({ name, price, stock }) {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>KES {price.toFixed(2)}</p>
      <p>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</p>
    </div>
  )
}

export default ProductCard
```

Use it in `App.jsx`:

```jsx
import ProductCard from './components/ProductCard'

function App() {
  return (
    <div>
      <h1>Our Products</h1>
      <ProductCard name="Notebook" price={150} stock={200} />
      <ProductCard name="Pen"      price={20}  stock={0}   />
      <ProductCard name="Backpack" price={850} stock={45}  />
    </div>
  )
}

export default App
```

---

## Composing Components

Components can contain other components — this is how UIs are built:

```jsx
function ProductList() {
  return (
    <div className="product-list">
      <ProductCard name="Notebook" price={150} stock={200} />
      <ProductCard name="Pen"      price={20}  stock={500} />
    </div>
  )
}

function App() {
  return (
    <div>
      <h1>Store</h1>
      <ProductList />
    </div>
  )
}
```

---

## Expressions in JSX

Anything inside `{}` is evaluated as JavaScript:

```jsx
const price = 850
const isOnSale = true

return (
  <div>
    <p>Price: KES {price}</p>
    <p>Original: KES {price / 0.9}</p>
    <p>{isOnSale ? 'ON SALE' : 'Regular price'}</p>
    <p>{price > 500 && 'Premium product'}</p>
  </div>
)
```

You cannot use `if` statements directly in JSX — use ternary (`? :`) or `&&` instead.

---

## Predict Before You Run

What does this render?

```jsx
const stock = 0

return (
  <div>
    <p>{stock > 0 ? 'Available' : 'Sold out'}</p>
    <p>{stock > 0 && 'Add to cart'}</p>
  </div>
)
```

<details>
<summary>Answer</summary>

```
Sold out

```

Line 1: `stock > 0` is false → shows "Sold out"  
Line 2: `stock > 0` is false → `false && 'Add to cart'` = false → React renders nothing (not even "false")

</details>

---

## Fill in the Blank

Complete the `Badge` component that shows "NEW" in green if the product was created within the last 7 days, otherwise shows nothing:

```jsx
function Badge({ isNew }) {
  return (
    <span>
      {___ && <span style={{ color: 'green' }}>NEW</span>}
    </span>
  )
}
```

<details>
<summary>Answer</summary>

```jsx
function Badge({ isNew }) {
  return (
    <span>
      {isNew && <span style={{ color: 'green' }}>NEW</span>}
    </span>
  )
}
```

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `class=` instead of `className=` | Warning in console | Always use `className` in JSX |
| Returning multiple root elements | Error | Wrap in `<div>` or `<>` |
| `{if (x) ...}` inside JSX | Syntax error | Use ternary or `&&` |
| Lowercase component name: `<productCard />` | Treated as HTML tag | Components must start with uppercase: `<ProductCard />` |

---

## When Things Go Wrong

**"Component is not defined"**  
You forgot to import it. Add `import ProductCard from './components/ProductCard'` at the top.

**"Each child in a list should have a unique key prop"**  
Covered in lesson 08 — for now just note the warning.

---

## Checkpoint

- [ ] You created `ProductCard.jsx` and rendered it in `App.jsx`
- [ ] You used `{}` to embed JavaScript expressions in JSX
- [ ] You used the ternary operator inside JSX
- [ ] You understand why components must start with uppercase

---

**Next lesson:** [04 — Props](./04-props)
