---
sidebar_position: 17
---

# Project — Inventory API

**Estimated time:** 3–5 hours  
**You will build:** A Spring Boot REST API for inventory management — products, suppliers, and stock tracking with JWT authentication.

---

## What You Are Building

A backend service where:
- Users register and log in (JWT)
- Authenticated users can manage products and suppliers
- Admins can manage all resources
- Stock changes are logged for auditing
- All data stored in MySQL (the same `ecommerce` database)

---

## Database Setup

Add these tables to your MySQL database:

```sql
CREATE TABLE IF NOT EXISTS suppliers (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL UNIQUE,
  contact_name VARCHAR(255),
  email        VARCHAR(255),
  phone        VARCHAR(50),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  product_id  INT NOT NULL,
  user_id     INT NOT NULL,
  type        ENUM('in', 'out', 'adjustment') NOT NULL,
  quantity    INT NOT NULL,
  note        VARCHAR(500),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id)    REFERENCES users(id)
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_id INT;
ALTER TABLE products ADD FOREIGN KEY (supplier_id) REFERENCES suppliers(id);
```

---

## Endpoints to Implement

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register, return JWT |
| POST | `/api/auth/login` | — | Login, return JWT |
| GET | `/api/auth/me` | JWT | Current user profile |

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | — | All products (pagination: `?page&limit`) |
| GET | `/api/products/:id` | — | Single product with supplier |
| POST | `/api/products` | JWT | Create product |
| PUT | `/api/products/:id` | JWT | Update product |
| DELETE | `/api/products/:id` | JWT | Delete product |
| POST | `/api/products/:id/stock` | JWT | Adjust stock (in/out/adjustment) |
| GET | `/api/products/:id/movements` | JWT | Stock movement history |

### Suppliers

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/suppliers` | JWT | All suppliers |
| GET | `/api/suppliers/:id` | JWT | Supplier + products |
| POST | `/api/suppliers` | JWT | Create supplier |
| PUT | `/api/suppliers/:id` | JWT | Update supplier |

---

## Request/Response Examples

**POST /api/products:**
```json
// Request
{
  "name": "Notebook",
  "price": 150.00,
  "stock": 100,
  "supplierId": 1
}

// Response 201
{
  "id": 1,
  "name": "Notebook",
  "price": 150.00,
  "stock": 100,
  "inStock": true,
  "supplier": { "id": 1, "name": "Stationery Ltd" }
}
```

**POST /api/products/1/stock:**
```json
// Request
{
  "type": "out",
  "quantity": 5,
  "note": "Sold to customer #42"
}

// Response 200
{
  "productId": 1,
  "previousStock": 100,
  "newStock": 95,
  "movement": { "id": 1, "type": "out", "quantity": 5 }
}
```

---

## Entities to Create

**Product:**
- `id`, `name`, `price`, `stock`, `supplierId`, `createdAt`, `updatedAt`
- Relationship: `@ManyToOne` to `Supplier`

**Supplier:**
- `id`, `name`, `contactName`, `email`, `phone`, `createdAt`
- Relationship: `@OneToMany` to `Product` (lazy)

**StockMovement:**
- `id`, `productId`, `userId`, `type` (enum), `quantity`, `note`, `createdAt`

---

## Business Rules

**Stock adjustment:**
- `type = 'out'` — decrease stock. Throw exception if `quantity > current stock`
- `type = 'in'` — increase stock
- `type = 'adjustment'` — set stock to an absolute value (for corrections)
- Every stock change creates a `StockMovement` record

**Pagination:**
- `GET /api/products?page=1&limit=20`
- Use Spring Data's `Pageable`: `repository.findAll(PageRequest.of(page - 1, limit))`
- Response: `{ "data": [...], "page": 1, "limit": 20, "total": 150 }`

**Stock movements:**
- Never delete a stock movement — it's an immutable audit log
- `GET /api/products/:id/movements` returns movements newest first, last 50

---

## Constraints

- All responses use DTOs — no entity returned directly from controllers
- Request DTOs use `@Valid` annotations — name not blank, price >= 0, stock >= 0
- `GlobalExceptionHandler` handles 400, 404, 409, and 500
- Passwords hashed with BCrypt (cost 12)
- JWT required for all write operations
- `@Transactional` on stock adjustment (query + insert must be atomic)

---

## Stretch Goals

- **Low stock alert endpoint:** `GET /api/products/low-stock?threshold=10` — returns products below threshold
- **Search:** `GET /api/products?search=notebook` — case-insensitive name search
- **Role-based access:** Only `role = ADMIN` can delete products or suppliers
- **Soft delete:** Instead of `DELETE`, set `deleted_at` timestamp. Exclude from all queries using `@Where(clause = "deleted_at IS NULL")`
- **Swagger/OpenAPI:** Add `springdoc-openapi-starter-webmvc-ui` — auto-generates API documentation at `/swagger-ui.html`

---

## Self-Review Checklist

**Functionality:**
- [ ] Register returns JWT, login returns JWT
- [ ] Unauthenticated POST returns 401
- [ ] Invalid request body returns 400 with field-level errors
- [ ] Non-existent product returns 404
- [ ] Stock `'out'` with insufficient quantity returns 400
- [ ] Stock adjustment is recorded in `stock_movements`

**Code quality:**
- [ ] No entity classes returned from controllers — all responses use DTOs
- [ ] No SQL written in service methods — all queries in repositories
- [ ] `@Transactional` on the stock adjustment service method
- [ ] Tests cover at least: GET all (200), GET one missing (404), POST without auth (401), POST invalid (400)

---

## How This Connects to Other Tracks

| This project | Connects to |
|-------------|------------|
| `products` table | Same table used in SQL, Python, React, and Node.js tracks |
| JWT auth pattern | Same as Python (PyJWT) and Node.js (jsonwebtoken) tracks |
| REST endpoint design | Same conventions as the Python Flask API |
| Entity → DTO pattern | React frontend only knows about DTOs — entities never leave the server |

When you've completed all five tracks, you have four different backends (SQL schema, Python API, Node.js chat, Java inventory API) and one React frontend — all sharing the same database. That's a real polyglot system.
