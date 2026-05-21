---
sidebar_position: 17
---

# Project — E-commerce REST API

**Estimated time:** 3–4 hours  
**This project tests everything from lessons 01–15.**

---

## What You Are Building

A fully working REST API for the e-commerce database you built in the SQL track.

This API is the backend that the **React track** frontend will connect to.  
Build it carefully — the React project depends on it being correct.

---

## Project Structure

```
ecommerce-api/
├── .env
├── .gitignore
├── requirements.txt
├── app.py
├── db.py
├── auth.py              ← JWT helper (require_auth decorator)
├── validation.py        ← reusable validate() function
├── tests/
│   ├── test_products.py
│   ├── test_orders.py
│   └── test_auth.py
└── routes/
    ├── __init__.py
    ├── auth.py
    ├── products.py
    ├── orders.py
    └── users.py
```

---

## API Endpoints to Build

### Auth
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | None | Register a new user |
| POST | `/api/auth/login` | None | Login, returns JWT token |

### Products
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/products` | None | List all active products |
| GET | `/api/products/<id>` | None | Get one product |
| POST | `/api/products` | Required | Create a product |
| PUT | `/api/products/<id>` | Required | Update a product |
| DELETE | `/api/products/<id>` | Required | Soft-delete a product |

### Orders
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/orders` | Required | Get current user's orders |
| POST | `/api/orders` | Required | Place a new order |
| GET | `/api/orders/<id>` | Required | Get order details with items |

### Users
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/users/profile` | Required | Get current user's profile |
| PUT | `/api/users/profile` | Required | Update profile |

---

## Requirements

### GET /api/products
- Returns all products where `is_active = TRUE`
- Supports optional query params: `?category=bags`, `?min_price=100`, `?max_price=500`
- Returns each product's category name (not just id)

### POST /api/orders
Request body:
```json
{
  "shipping_address": "123 Kimathi St, Nairobi",
  "items": [
    {"product_id": 1, "quantity": 2},
    {"product_id": 3, "quantity": 1}
  ]
}
```
This endpoint must:
1. Validate all items exist and are in stock
2. Lock stock so two users cannot buy the last item simultaneously — use a transaction
3. Deduct stock for each item
4. Record the order total as the sum of `quantity * price` at time of purchase
5. Return the created order with all its items

### GET /api/orders/:id
Returns the full order:
```json
{
  "id": 1,
  "status": "pending",
  "total": 1000.00,
  "created_at": "2026-05-21T14:30:00",
  "items": [
    {"product": "Notebook", "quantity": 2, "unit_price": 150.00, "subtotal": 300.00},
    {"product": "Backpack", "quantity": 1, "unit_price": 850.00, "subtotal": 850.00}
  ]
}
```

---

## Validation Requirements

Every endpoint that accepts input must validate:
- All required fields are present
- Types are correct
- Numbers are within range
- Strings have max_length limits
- Unknown extra fields are ignored (do not error on them)

---

## Testing Requirements

Write tests that cover:
- [ ] Register with valid data → 201
- [ ] Register with duplicate email → 409
- [ ] Login with correct credentials → 200 + token
- [ ] Login with wrong password → 401
- [ ] Get products → 200 + list
- [ ] Create product without auth → 401
- [ ] Create product with auth + valid data → 201
- [ ] Create product with negative price → 400
- [ ] Place order with insufficient stock → 400
- [ ] Place order with valid data → 201

---

## Reference Implementation Notes

<details>
<summary>Placing an order — transaction pattern</summary>

```python
@orders_bp.route("/", methods=["POST"])
@require_auth
def create_order():
    data    = request.get_json()
    user_id = request.user["user_id"]
    items   = data.get("items", [])
    address = data.get("shipping_address", "").strip()

    if not items or not address:
        return jsonify({"error": "items and shipping_address required"}), 400

    conn   = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        conn.start_transaction()

        total = 0
        validated_items = []

        for item in items:
            product_id = item.get("product_id")
            quantity   = item.get("quantity", 1)

            cursor.execute(
                "SELECT id, name, price, stock FROM products WHERE id = %s AND is_active = TRUE FOR UPDATE",
                (product_id,)
            )
            product = cursor.fetchone()

            if not product:
                conn.rollback()
                return jsonify({"error": f"Product {product_id} not found"}), 400

            if product["stock"] < quantity:
                conn.rollback()
                return jsonify({"error": f"Insufficient stock for {product['name']}"}), 400

            validated_items.append({
                "product_id": product["id"],
                "quantity":   quantity,
                "unit_price": float(product["price"]),
                "subtotal":   float(product["price"]) * quantity,
            })
            total += float(product["price"]) * quantity

        # Create order
        cursor.execute(
            "INSERT INTO orders (user_id, shipping_address, total) VALUES (%s, %s, %s)",
            (user_id, address, total)
        )
        order_id = cursor.lastrowid

        # Insert items and deduct stock
        for item in validated_items:
            cursor.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (%s, %s, %s, %s)",
                (order_id, item["product_id"], item["quantity"], item["unit_price"])
            )
            cursor.execute(
                "UPDATE products SET stock = stock - %s WHERE id = %s",
                (item["quantity"], item["product_id"])
            )

        conn.commit()
        return jsonify({"id": order_id, "total": total, "status": "pending"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": "Order failed"}), 500

    finally:
        cursor.close()
        conn.close()
```

`FOR UPDATE` locks the selected rows so two simultaneous transactions cannot both see the same stock level.

</details>

---

## You Have Completed the Python Track

You have built:
- A secure authentication system (register, login, JWT)
- A full CRUD API for products
- An order placement system with transaction safety
- Input validation on every endpoint
- Automated tests

**This API is now the backend for the React frontend.**  
Keep it running — the React track will call it.

---

**Next track:** [React →](../react/intro)
