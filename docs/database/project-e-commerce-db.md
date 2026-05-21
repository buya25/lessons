---
sidebar_position: 17
---

# Project — E-commerce Database

**Estimated time:** 2–3 hours  
**This project tests everything from lessons 01–15.**

---

## What You Are Building

A complete database for an e-commerce platform — the kind that powers stores like Jumia or Amazon.

This database will be reused in:
- The **Python** track (you will build an API on top of it)
- The **React** track (you will build the frontend)
- The **Node.js** track (you will add real-time order notifications)

Build it carefully. It is the foundation of everything that follows.

---

## The Schema

You need to design and create these 8 tables:

```
users           — everyone with an account
categories      — product categories (Electronics, Clothing, etc.)
products        — every item for sale
product_images  — photos for each product (one product, many images)
orders          — every purchase placed
order_items     — products inside each order (many-to-many junction table)
payments        — payment record for each order
reviews         — user reviews on products
```

---

## Requirements

Before writing any SQL, read all requirements. Plan the columns and relationships on paper first.

### users
- id, name, email (unique), password_hash, phone (optional), is_active (default true)
- created_at, updated_at

### categories
- id, name (unique), description (optional)
- parent_id — a category can have a parent category (e.g. "Phones" belongs to "Electronics")  
  This is a **self-referencing foreign key**: `FOREIGN KEY (parent_id) REFERENCES categories(id)`

### products
- id, name, description, price (must be >= 0), stock (must be >= 0, default 0)
- category_id (foreign key to categories)
- is_active (default true), created_at

### product_images
- id, product_id (foreign key), url (the image path), is_primary (default false)

### orders
- id, user_id (foreign key), status: one of `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- shipping_address (TEXT), total (decimal, must be >= 0)
- created_at, updated_at

### order_items
- id, order_id, product_id (both foreign keys)
- quantity (must be > 0), unit_price (price at time of purchase — important: product prices change)
- subtotal (generated column: `quantity * unit_price`)

### payments
- id, order_id (foreign key, unique — one payment per order)
- amount, method: `mpesa`, `card`, `bank`, `cash`
- status: `pending`, `completed`, `failed`, `refunded`
- transaction_ref (unique reference number from the payment provider)
- paid_at (datetime, null until payment is confirmed)

### reviews
- id, user_id, product_id (both foreign keys)
- rating: integer 1–5 (use a CHECK constraint)
- comment (text, optional)
- created_at
- Constraint: a user can only review a product once (UNIQUE on user_id + product_id)

---

## Step 1 — Create the Database

```sql
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;
```

---

## Step 2 — Write the CREATE TABLE Statements

Write all 8 tables yourself before looking at the reference solution below.

**Tips:**
- Create tables in the right order — parent tables first, child tables second
- Add all constraints as you go, not after
- Use `DECIMAL(10,2)` for all money columns
- Use `VARCHAR(20)` for status columns with fixed options
- Every table needs `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`

Take your time. A well-designed schema now saves you hours of debugging later.

---

## Step 3 — Add Sample Data

Once your tables are created, insert realistic sample data:

- 5 users
- 3 categories (with at least one subcategory)
- 8 products across the categories
- 3 orders with order_items
- Payment records for the completed orders
- At least 4 reviews

---

## Step 4 — Write These Queries

Once data is inserted, write SQL to answer each question:

1. Show all products with their category name (not just category_id)
2. Show all orders with the customer's name and total
3. Show the top 3 most expensive products
4. Show users who have placed at least 2 orders
5. Calculate the total revenue from all `completed` payments
6. Show all products with their average rating (only products that have at least 1 review)
7. Show each category with the number of products in it
8. Find users who have never placed an order
9. Show all products that are low on stock (less than 10 units)
10. Show the full order details for order id = 1: customer name, each product name, quantity, unit price, subtotal

---

## Reference Solution

Only read this after you have made a genuine attempt at each table.

<details>
<summary>Show table definitions</summary>

```sql
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE users (
  id            INT           NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  phone         VARCHAR(20),
  is_active     BOOLEAN       DEFAULT TRUE,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE categories (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  description TEXT,
  parent_id   INT,
  PRIMARY KEY (id),
  UNIQUE (name),
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE products (
  id          INT            NOT NULL AUTO_INCREMENT,
  name        VARCHAR(150)   NOT NULL,
  description TEXT,
  price       DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
  stock       INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id INT,
  is_active   BOOLEAN        DEFAULT TRUE,
  created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE product_images (
  id         INT          NOT NULL AUTO_INCREMENT,
  product_id INT          NOT NULL,
  url        VARCHAR(255) NOT NULL,
  is_primary BOOLEAN      DEFAULT FALSE,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id               INT            NOT NULL AUTO_INCREMENT,
  user_id          INT            NOT NULL,
  status           VARCHAR(20)    NOT NULL DEFAULT 'pending',
  shipping_address TEXT           NOT NULL,
  total            DECIMAL(10,2)  NOT NULL DEFAULT 0.00 CHECK (total >= 0),
  created_at       DATETIME       DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE order_items (
  id         INT           NOT NULL AUTO_INCREMENT,
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal   DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

CREATE TABLE payments (
  id              INT           NOT NULL AUTO_INCREMENT,
  order_id        INT           NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  method          VARCHAR(20)   NOT NULL,
  status          VARCHAR(20)   NOT NULL DEFAULT 'pending',
  transaction_ref VARCHAR(100),
  paid_at         DATETIME,
  PRIMARY KEY (id),
  UNIQUE (order_id),
  UNIQUE (transaction_ref),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT
);

CREATE TABLE reviews (
  id         INT       NOT NULL AUTO_INCREMENT,
  user_id    INT       NOT NULL,
  product_id INT       NOT NULL,
  rating     INT       NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    TEXT,
  created_at DATETIME  DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (user_id, product_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

</details>

<details>
<summary>Show query answers</summary>

```sql
-- 1. Products with category name
SELECT p.name, p.price, c.name AS category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- 2. Orders with customer name
SELECT o.id, u.name AS customer, o.total, o.status
FROM orders o
INNER JOIN users u ON o.user_id = u.id;

-- 3. Top 3 most expensive products
SELECT name, price FROM products ORDER BY price DESC LIMIT 3;

-- 4. Users with at least 2 orders
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
INNER JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING COUNT(o.id) >= 2;

-- 5. Total revenue from completed payments
SELECT SUM(amount) AS total_revenue
FROM payments
WHERE status = 'completed';

-- 6. Products with average rating (at least 1 review)
SELECT p.name, ROUND(AVG(r.rating), 1) AS avg_rating, COUNT(r.id) AS review_count
FROM products p
INNER JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name;

-- 7. Categories with product count
SELECT c.name, COUNT(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;

-- 8. Users who never placed an order
SELECT u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- 9. Products low on stock
SELECT name, stock FROM products WHERE stock < 10 ORDER BY stock ASC;

-- 10. Full order details for order id = 1
SELECT
  u.name          AS customer,
  p.name          AS product,
  oi.quantity,
  oi.unit_price,
  oi.subtotal
FROM order_items oi
INNER JOIN orders   o ON oi.order_id   = o.id
INNER JOIN users    u ON o.user_id     = u.id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.id = 1;
```

</details>

---

## You Are Done With the Database Track

You have learned:
- What a database is and how to set one up
- All five CRUD operations (Create, Read, Update, Delete)
- Data types and constraints
- Aggregate functions and grouping
- Relationships and foreign keys
- Joins across multiple tables
- Indexes for performance
- Transactions for data integrity
- How to design a real-world schema from scratch

**This database is your foundation.** In the Python track, you will build a REST API on top of it.  
Keep the `ecommerce` database running — you will need it.

---

**Next track:** [Python →](../python/intro)
