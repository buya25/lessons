---
sidebar_position: 16
---

# 15 — Styling and Polish

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** style a React app with CSS Modules, add loading skeletons, and handle empty and error states properly.

---

## The Hook

Your app works. Now make it look like a real product.

Good UI is not about making things pretty — it is about making things **clear**.  
Every state your app can be in (loading, error, empty, success) needs to look intentional, not broken.

---

## CSS Modules — Scoped Styles

CSS Modules prevent class name collisions — styles only apply to the component they are imported into.

Create `src/components/ProductCard.module.css`:

```css
.card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.25rem;
  color: #2563eb;
  font-weight: 700;
}

.outOfStock {
  color: #dc2626;
  font-size: 0.85rem;
}

.addBtn {
  width: 100%;
  padding: 0.6rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.75rem;
}

.addBtn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
```

Use it in `ProductCard.jsx`:

```jsx
import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.price}>KES {product.price.toFixed(2)}</p>
      {product.stock === 0 && <p className={styles.outOfStock}>Out of stock</p>}
    </div>
  )
}
```

---

## Global Styles

Keep global styles minimal in `src/index.css`:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
}

a { color: inherit; text-decoration: none; }

button { font-family: inherit; cursor: pointer; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

---

## Loading Skeleton

A skeleton is better than a spinner — it shows the shape of incoming content:

```jsx
function ProductCardSkeleton() {
  return (
    <div className={styles.card} style={{ animation: 'pulse 1.5s infinite' }}>
      <div style={{ height: 24, background: '#e2e8f0', borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 20, background: '#e2e8f0', borderRadius: 4, width: '60%' }} />
    </div>
  )
}

// Add to index.css:
// @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
```

Use it:
```jsx
if (loading) {
  return (
    <div className="product-grid">
      {[1,2,3,4,5,6].map(i => <ProductCardSkeleton key={i} />)}
    </div>
  )
}
```

---

## Error Boundary Component

Create `src/components/ErrorMessage.jsx`:

```jsx
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
      <p>⚠ {message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: '1rem' }}>
          Try Again
        </button>
      )}
    </div>
  )
}
```

---

## Responsive Product Grid

```css
/* In a global or page CSS file */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem 0;
}
```

`auto-fill` + `minmax` = responsive grid with no media queries. Cards reflow automatically.

---

## Navbar Styles

```css
.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
```

---

## Polish Checklist

Before considering the UI done, check every state:

- [ ] **Loading** — skeleton or spinner shown, not blank
- [ ] **Error** — clear message with retry option
- [ ] **Empty** — message + call to action (not just blank space)
- [ ] **Success** — confirmation shown (toast or redirect)
- [ ] **Disabled** — buttons disabled during async operations
- [ ] **Mobile** — layout works on a phone screen

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Global class names like `.card` | Styles bleed across components | Use CSS Modules |
| Spinner without timeout handling | Spinner spins forever on network failure | Always have an error state |
| No empty state | Blank page looks broken | Always handle empty lists/data |
| Fixed pixel widths | Breaks on mobile | Use `%`, `rem`, `fr`, or `auto-fill` grid |

---

## Checkpoint

- [ ] `ProductCard` uses CSS Modules with hover effect
- [ ] Loading skeleton shows instead of blank space
- [ ] `ErrorMessage` component handles fetch failures with retry
- [ ] Product grid is responsive with `auto-fill`
- [ ] Navbar is sticky with correct styling

---

**Next:** [Project — E-commerce Frontend](./project-e-commerce-frontend)
