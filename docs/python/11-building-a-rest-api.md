---
sidebar_position: 12
---

# 11 — Building a REST API with Flask

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** create API endpoints that receive HTTP requests and return JSON responses.

---

## The Hook

Your database has data. Your React frontend needs that data.  
The bridge between them is a **REST API** — a server that listens for requests over HTTP and responds with data in JSON format.

When the frontend visits `/api/products`, your Python server queries the database and sends back a list of products as JSON. That is the entire idea.

---

## Install Flask

```bash
pip install flask
```

---

## Your First Flask App

Create `app.py`:

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "API is running"

if __name__ == "__main__":
    app.run(debug=True)
```

Run it:

```bash
python app.py
```

Open your browser at `http://localhost:5000` — you should see "API is running".

---

## Returning JSON

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/products")
def get_products():
    products = [
        {"id": 1, "name": "Notebook", "price": 150},
        {"id": 2, "name": "Pen",      "price": 20},
    ]
    return jsonify(products)
```

Visit `http://localhost:5000/api/products` and you will see clean JSON output.

---

## Connect Flask to MySQL

```python
from flask import Flask, jsonify
from db import get_connection

app = Flask(__name__)

@app.route("/api/products")
def get_products():
    conn   = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, price, stock FROM products WHERE is_active = TRUE")
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(products)

if __name__ == "__main__":
    app.run(debug=True)
```

Now the API pulls real data from your database.

---

## URL Parameters — Get One Product

```python
@app.route("/api/products/<int:product_id>")
def get_product(product_id):
    conn   = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
    product = cursor.fetchone()
    cursor.close()
    conn.close()

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(product)
```

Visit `http://localhost:5000/api/products/1` for product 1, `/api/products/2` for product 2.

---

## HTTP Methods — GET vs POST

| Method | Use for |
|--------|---------|
| `GET` | Retrieve data |
| `POST` | Create new data |
| `PUT` / `PATCH` | Update existing data |
| `DELETE` | Delete data |

Handling a POST request (creating a product):

```python
from flask import Flask, jsonify, request

@app.route("/api/products", methods=["POST"])
def create_product():
    data = request.get_json()

    name  = data.get("name")
    price = data.get("price")
    stock = data.get("stock", 0)

    if not name or price is None:
        return jsonify({"error": "name and price are required"}), 400

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
```

Test with curl or a tool like Postman / Insomnia:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Ruler", "price": 15, "stock": 300}'
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK — success |
| `201` | Created — new resource created |
| `400` | Bad Request — invalid input from client |
| `404` | Not Found — resource does not exist |
| `500` | Internal Server Error — something broke on the server |

Return a status code as the second value in the return tuple:

```python
return jsonify(data), 200
return jsonify({"error": "not found"}), 404
```

---

## Error Handling in Flask

```python
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500
```

---

## Predict Before You Run

What HTTP status code should each of these return?

1. Successfully retrieved a list of products
2. User submitted a form with a missing required field
3. User requested product id 999 which does not exist
4. A database error occurred mid-request

<details>
<summary>Answers</summary>

1. `200 OK`
2. `400 Bad Request`
3. `404 Not Found`
4. `500 Internal Server Error`

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Returning a plain dict instead of `jsonify()` | Works in newer Flask but not consistent | Always use `jsonify()` |
| No status code on error responses | Client gets `200` but an error body | Always return the right code: `return jsonify(...), 404` |
| `debug=True` in production | Exposes internals to the internet | Only use `debug=True` locally |
| No input validation | Bad data reaches the database | Always validate before inserting |

---

## When Things Go Wrong

**`Address already in use` when starting Flask**  
Port 5000 is occupied. Either stop the other process or run on a different port: `app.run(port=5001)`.

**`werkzeug.exceptions.BadRequest: 400 Bad Request`**  
Your POST request is missing the `Content-Type: application/json` header, or the body is not valid JSON.

**CORS errors when calling from the browser**  
Install `flask-cors` and add it to your app — covered in the project.

---

## Checkpoint

- [ ] Flask is installed and a basic app runs
- [ ] `GET /api/products` returns real data from MySQL
- [ ] `GET /api/products/<id>` returns a single product or 404
- [ ] `POST /api/products` creates a new product and returns 201
- [ ] You understand what HTTP status codes mean

---

**Next lesson:** [12 — Authentication with JWT](./12-authentication)
