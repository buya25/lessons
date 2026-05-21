---
sidebar_position: 17
---

# Project — E-commerce Frontend

**Estimated time:** 3–4 hours  
**This project tests everything from lessons 01–15.**

---

## What You Are Building

A complete e-commerce frontend that connects to the Python API from the previous track.

Users can browse products, search and filter, add to cart, register, login, place orders, and view their order history.

---

## Pages to Build

| Page | Route | Auth required |
|------|-------|--------------|
| Home | `/` | No |
| Products | `/products` | No |
| Product Detail | `/products/:id` | No |
| Cart | `/cart` | No (redirect to login on checkout) |
| Login | `/login` | No |
| Register | `/register` | No |
| Order Confirmation | `/orders/:id` | Yes |
| Order History | `/orders` | Yes |
| 404 | `*` | No |

---

## Requirements

### Home Page
- Hero banner with a "Shop Now" button linking to `/products`
- Featured products section (show the 6 newest products from the API)
- Clean, welcoming layout

### Products Page
- Fetch and display all products in a responsive grid
- Search bar that filters by name (debounced — no API call on every keystroke)
- Category filter dropdown
- Sort by: price low-high, price high-low, name A-Z
- Loading skeleton while fetching
- Error state with retry button
- Empty state when no products match filters

### Product Detail Page
- Full product info: name, price, description, category, stock
- "Add to Cart" button (disabled when out of stock)
- Stock count shown
- Breadcrumb: Home → Products → Product Name

### Cart Page
- List all cart items with name, quantity controls, subtotal
- Order total at the bottom
- Shipping address input
- "Place Order" button — calls API, shows loading, navigates to confirmation on success
- Empty cart state with "Shop Now" link
- Redirect to login if user tries to checkout without being logged in

### Login / Register Pages
- Clean forms with validation
- Error messages from API displayed
- Loading state on submit button
- Link between the two pages

### Order Confirmation Page
- Show: order ID, status, items ordered, quantities, prices, total
- "Continue Shopping" button
- "View All Orders" link

### Order History Page
- List of all user's past orders
- Each order shows: date, status, total, item count
- Click an order to go to its detail page

---

## Component Checklist

Build these reusable components (each in its own file):

- [ ] `Navbar` — logo, links, cart count, login/logout
- [ ] `ProductCard` — image placeholder, name, price, stock, add-to-cart button
- [ ] `ProductCardSkeleton` — loading state for ProductCard
- [ ] `CartItem` — item row with quantity controls
- [ ] `ErrorMessage` — error display with optional retry
- [ ] `ProtectedRoute` — redirects to login if no token
- [ ] `LoadingSpinner` — simple spinner for page-level loading
- [ ] `Badge` — small coloured tag (New, Sale, Out of Stock)

---

## Context Checklist

- [ ] `AuthContext` — user, token, login(), logout(), isLoggedIn
- [ ] `CartContext` — cart, addToCart(), removeFromCart(), clearCart(), total

---

## Services Checklist

- [ ] `api.js` — axios instance, JWT interceptor, 401 handler
- [ ] `productService.js` — getAll, getOne, create, update, delete
- [ ] `authService.js` — login, register
- [ ] `orderService.js` — placeOrder, getMyOrders, getOne

---

## Polish Requirements

Every page must handle:
- [ ] Loading state (skeleton or spinner)
- [ ] Error state (with retry where applicable)
- [ ] Empty state (no products, no orders — clear message + action)
- [ ] Mobile layout (works on a phone screen)

---

## Stretch Goals (Optional)

If you finish early:
- Add a quantity selector on the Product Detail page before adding to cart
- Add a "Recently Viewed" section on the home page (stored in localStorage)
- Add toast notifications for cart actions ("Added to cart!")
- Add pagination to the products page
- Show an order status timeline on the Order Detail page

---

## Reference: App.jsx Structure

<details>
<summary>Show App.jsx with all routes wired up</summary>

```jsx
import { Routes, Route } from 'react-router-dom'
import Navbar          from './components/Navbar'
import ProtectedRoute  from './components/ProtectedRoute'
import HomePage        from './pages/HomePage'
import ProductsPage    from './pages/ProductsPage'
import ProductDetail   from './pages/ProductDetail'
import CartPage        from './pages/CartPage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import OrderDetail     from './pages/OrderDetail'
import OrderHistory    from './pages/OrderHistory'
import NotFoundPage    from './pages/NotFoundPage'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/"            element={<HomePage />}     />
          <Route path="/products"    element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart"        element={<CartPage />}     />
          <Route path="/login"       element={<LoginPage />}    />
          <Route path="/register"    element={<RegisterPage />} />
          <Route path="/orders/:id"  element={
            <ProtectedRoute><OrderDetail /></ProtectedRoute>
          } />
          <Route path="/orders"      element={
            <ProtectedRoute><OrderHistory /></ProtectedRoute>
          } />
          <Route path="*"            element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}
```

</details>

---

## You Have Completed the React Track

You have built:
- A full multi-page React application
- Client-side routing with React Router
- Global state management with Context API
- JWT authentication (login, register, protected routes)
- Real API integration with axios and a service layer
- Responsive UI with CSS Modules
- Complete shopping cart and checkout flow

**This frontend connects to the Python API and the SQL database.**  
All three tracks now work together as one full-stack application.

---

**Next track:** [Node.js →](../nodejs/intro)
