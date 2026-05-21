---
sidebar_position: 5
---

# 04 — Props

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** pass data into components with props, set default prop values, and pass functions as props.

---

## The Hook

In the last lesson `ProductCard` always showed fixed data.  
**Props** are how you make components dynamic — pass different data, get different output.

Props flow **down** from parent to child. A parent component controls what a child displays.

---

## Passing Props

```jsx
// Parent passes props
<ProductCard name="Notebook" price={150} stock={200} />

// Child receives them
function ProductCard(props) {
  return (
    <div>
      <h3>{props.name}</h3>
      <p>KES {props.price}</p>
    </div>
  )
}
```

---

## Destructuring Props — The Clean Way

Instead of `props.name`, `props.price` everywhere:

```jsx
function ProductCard({ name, price, stock }) {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>KES {price.toFixed(2)}</p>
      <p className={stock > 0 ? 'in-stock' : 'out-of-stock'}>
        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
      </p>
    </div>
  )
}
```

This is the pattern you will use in every component.

---

## Default Props

Set a fallback if a prop is not provided:

```jsx
function ProductCard({ name, price, stock = 0 }) {
  // stock defaults to 0 if not passed
}
```

Or use a default in the destructure directly:

```jsx
function Button({ label = 'Click me', type = 'button' }) {
  return <button type={type}>{label}</button>
}

// Uses defaults:
<Button />

// Overrides defaults:
<Button label="Add to Cart" type="submit" />
```

---

## Passing Any Value as a Prop

```jsx
// String — quotes only
<Component name="Alice" />

// Number — curly braces
<Component price={150} />

// Boolean — curly braces (or just the name for true)
<Component isActive={true} />
<Component isActive />      // same as isActive={true}

// Object
<Component style={{ color: 'red', fontSize: 14 }} />

// Array
<Component items={[1, 2, 3]} />

// Function
<Component onClick={() => console.log('clicked')} />
```

---

## Passing Functions as Props

A parent can pass a function down to a child. The child calls it when something happens.

```jsx
function ProductCard({ name, price, onAddToCart }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>KES {price}</p>
      <button onClick={() => onAddToCart({ name, price })}>
        Add to Cart
      </button>
    </div>
  )
}

function App() {
  function handleAddToCart(product) {
    console.log('Added:', product.name)
  }

  return (
    <ProductCard
      name="Notebook"
      price={150}
      onAddToCart={handleAddToCart}
    />
  )
}
```

This is how React handles events — the child notifies the parent.

---

## The children Prop

Special prop for content nested inside a component's tags:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>
}

// Use it:
<Card>
  <h2>Product Title</h2>
  <p>Some description here</p>
</Card>
```

`children` is whatever you put between the opening and closing tags.

---

## Predict Before You Run

```jsx
function Tag({ label, colour = 'grey' }) {
  return <span style={{ background: colour }}>{label}</span>
}

// What does each render?
<Tag label="Sale" colour="red" />
<Tag label="New" />
<Tag colour="blue" />
```

<details>
<summary>Answer</summary>

1. Red span with "Sale"
2. Grey span with "New" (default colour used)
3. Blue span with nothing visible — `label` is undefined, renders empty

</details>

---

## Fill in the Blank

Complete the `Alert` component that takes a `message` and a `type` (`"error"`, `"success"`, `"info"`), and displays the message with a matching background colour.

```jsx
const colours = {
  error:   '#fee2e2',
  success: '#dcfce7',
  info:    '#dbeafe',
}

function Alert({ ___, type = 'info' }) {
  return (
    <div style={{ background: colours[___], padding: '1rem' }}>
      {___}
    </div>
  )
}
```

<details>
<summary>Answer</summary>

```jsx
function Alert({ message, type = 'info' }) {
  return (
    <div style={{ background: colours[type], padding: '1rem' }}>
      {message}
    </div>
  )
}
```

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Passing a number as a string: `price="150"` | `"150".toFixed()` errors | Use `price={150}` |
| Modifying props inside a child component | Warning + bugs | Props are read-only — never change them |
| Misspelling a prop name | Silent `undefined` | Check capitalisation — props are case-sensitive |

---

## Checkpoint

- [ ] You passed strings, numbers, and booleans as props
- [ ] You used destructuring to receive props
- [ ] You set a default prop value
- [ ] You passed a function as a prop and called it from the child
- [ ] You used the `children` prop

---

**Next lesson:** [05 — State with useState](./05-state-with-usestate)
