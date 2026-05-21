---
sidebar_position: 2
---

# 01 — What is React?

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain what React is, why it exists, and how it differs from plain HTML.

---

## The Hook

Open any modern website — Instagram, Airbnb, Netflix.  
When you like a post, the heart fills instantly. No page reload. No waiting.

That instant, live updating behaviour is what React was built for.

React is a JavaScript library for building **user interfaces** — the part of an app the user sees and interacts with. It was created by Facebook and is now used by almost every major tech company.

---

## The Problem React Solves

With plain HTML and JavaScript, updating the page when data changes is painful:

```html
<!-- You have to manually find elements and change them -->
<span id="count">0</span>

<script>
  let count = 0;
  document.getElementById("count").textContent = count + 1;
</script>
```

As apps grow, this becomes impossible to manage. You end up tracking what changed, what needs updating, and in what order — all manually.

React solves this with one simple idea:

> **Describe what the UI should look like for a given state. React handles updating the page.**

You say: *"When count is 5, show the number 5."*  
React figures out what changed and updates only that part of the page.

---

## How React Works

React builds a **component tree** — your UI broken into reusable pieces:

```
App
├── Navbar
├── ProductList
│   ├── ProductCard
│   ├── ProductCard
│   └── ProductCard
└── Footer
```

Each component is a JavaScript function that returns what it looks like.  
When data changes, React re-renders only the components that need updating.

---

## What We Will Build

A complete e-commerce frontend that:
- Shows products from the Python API
- Lets users register and log in
- Has a shopping cart
- Lets users place orders and view order history

It connects directly to the API you built in the Python track.

---

## Prerequisites

- Complete the [Python track](../python/intro) first — the API must be running
- Basic HTML knowledge (tags, attributes)
- Basic JavaScript (variables, functions, arrays) — the Python track covers the concepts; the syntax is similar

---

## What You Need to Know About JavaScript First

React is JavaScript. Before writing React you need to be comfortable with these JS concepts:

```javascript
// Arrow functions
const greet = (name) => `Hello, ${name}`;

// Destructuring
const { name, price } = product;
const [first, ...rest] = items;

// Spread operator
const updated = { ...product, price: 900 };

// Array methods
const names = products.map(p => p.name);
const cheap = products.filter(p => p.price < 200);
```

If these look unfamiliar, spend 30 minutes on a JavaScript basics guide before continuing.  
You do not need to master them — you just need to recognise them.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Trying to learn React without knowing JavaScript basics | Do a quick JS refresher first |
| Thinking React is a full framework like Django | React only handles the UI layer — you still need a backend |
| Confusing React (library) with React Native (mobile) | React = web browser, React Native = iOS/Android |

---

## Checkpoint

- [ ] You can explain what React is in one sentence
- [ ] You understand why plain JS DOM manipulation does not scale
- [ ] You know what the Python API does and that React will connect to it
- [ ] You recognise arrow functions, destructuring, and array methods

---

**Next lesson:** [02 — Setting Up React](./02-setting-up-react)
