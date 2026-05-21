---
sidebar_position: 14
---

# 13 — Structuring a Flask App

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** organise a Flask project into multiple files using Blueprints, keeping your code clean as it grows.

---

## The Hook

If you put all your routes in one `app.py`, it grows to 500 lines fast.  
Products, users, orders, authentication — all tangled together.

Flask **Blueprints** let you split routes into separate files. Each group of related routes lives in its own file. `app.py` just registers them.

---

## The Target Structure

```
api/
├── .env
├── requirements.txt
├── app.py              ← creates the Flask app, registers blueprints
├── db.py               ← database connection helper
└── routes/
    ├── __init__.py     ← empty file (marks folder as a Python package)
    ├── auth.py         ← /api/auth/* routes
    ├── products.py     ← /api/products/* routes
    └── orders.py       ← /api/orders/* routes
```

---

## db.py

```python
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host     = os.getenv("DB_HOST"),
        user     = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME"),
    )
```

---

## routes/products.py

```python
from flask import Blueprint, jsonify, request
from db import get_connection

products_bp = Blueprint("products", __name__)

@products_bp.route("/", methods=["GET"])
def get_all():
    conn   = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, price, stock FROM products WHERE is_active = TRUE")
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(products)

@products_bp.route("/<int:product_id>", methods=["GET"])
def get_one(product_id):
    conn   = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE id = %s AND is_active = TRUE", (product_id,))
    product = cursor.fetchone()
    cursor.close()
    conn.close()
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product)

@products_bp.route("/", methods=["POST"])
def create():
    data  = request.get_json()
    name  = data.get("name")
    price = data.get("price")
    stock = data.get("stock", 0)

    if not name or price is None:
        return jsonify({"error": "name and price required"}), 400

    conn   = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (name, price, stock) VALUES (%s, %s, %s)",
        (name, price, stock)
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return jsonify({"id": new_id, "name": name, "price": price}), 201

@products_bp.route("/<int:product_id>", methods=["DELETE"])
def delete(product_id):
    conn   = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE products SET is_active = FALSE WHERE id = %s", (product_id,))
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()
    if affected == 0:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"message": "Product deleted"}), 200
```

---

## routes/__init__.py

Leave this file empty. Its presence tells Python that `routes/` is a package.

---

## app.py — Register All Blueprints

```python
from flask import Flask
from flask_cors import CORS
from routes.products import products_bp
from routes.auth     import auth_bp

app = Flask(__name__)
CORS(app)  # allows the React frontend to call this API

app.register_blueprint(products_bp, url_prefix="/api/products")
app.register_blueprint(auth_bp,     url_prefix="/api/auth")

@app.errorhandler(404)
def not_found(e):
    return {"error": "Not found"}, 404

@app.errorhandler(500)
def server_error(e):
    return {"error": "Server error"}, 500

if __name__ == "__main__":
    app.run(debug=True)
```

Install flask-cors:

```bash
pip install flask-cors
```

---

## requirements.txt

Keep this up to date:

```bash
pip freeze > requirements.txt
```

Anyone cloning the repo can run `pip install -r requirements.txt` and get everything.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Missing `__init__.py` in `routes/` | `ModuleNotFoundError` | Create an empty `__init__.py` |
| Forgetting `url_prefix` | Routes clash or disappear | Always set prefix when registering blueprints |
| Not running `pip freeze` before pushing | Collaborators cannot install packages | Always update `requirements.txt` |
| `CORS(app)` missing | Browser blocks requests from React | Add `flask-cors` and `CORS(app)` |

---

## Checkpoint

- [ ] You have the folder structure above in place
- [ ] `routes/products.py` has all four operations (GET all, GET one, POST, DELETE)
- [ ] `app.py` registers both blueprints
- [ ] `requirements.txt` is up to date
- [ ] The API runs and all endpoints respond correctly

---

**Next lesson:** [14 — Input Validation](./14-input-validation)
