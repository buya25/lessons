---
sidebar_position: 13
---

# 12 — Authentication with JWT

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** register users, verify passwords securely, and protect API endpoints with JWT tokens.

---

## The Hook

Right now, anyone can call `POST /api/products` and create products. Anyone can delete anything.

Authentication answers: *who are you?*  
Authorization answers: *what are you allowed to do?*

This lesson handles both using **JWT (JSON Web Tokens)** — the industry standard for API authentication.

---

## How JWT Authentication Works

```
1. User sends email + password to POST /api/auth/login
2. Server checks the password against the database
3. If correct, server sends back a signed JWT token
4. User sends that token in future requests: Authorization: Bearer <token>
5. Server verifies the token — if valid, allows the request
```

The token is like a signed wristband at an event. You prove your identity once, then show the wristband each time.

---

## Install Dependencies

```bash
pip install bcrypt PyJWT
```

- `bcrypt` — hashes passwords securely
- `PyJWT` — creates and verifies JWT tokens

---

## Hashing Passwords — Never Store Plaintext

```python
import bcrypt

password = "mysecretpassword"

# Hash the password (do this on registration)
hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
print(hashed)  # b'$2b$12$...' — different every time

# Verify a password (do this on login)
is_correct = bcrypt.checkpw(password.encode("utf-8"), hashed)
print(is_correct)  # True
```

A hash is a one-way transformation — you cannot reverse it to get the original password.  
Even if your database is stolen, the passwords are safe.

---

## Register Endpoint

```python
from flask import request, jsonify
from db import get_connection
import bcrypt

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    name     = data.get("name")
    email    = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"error": "name, email, and password are required"}), 400

    password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    conn   = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
            (name, email, password_hash)
        )
        conn.commit()
        return jsonify({"message": "User created", "id": cursor.lastrowid}), 201
    except Exception as e:
        if "Duplicate entry" in str(e):
            return jsonify({"error": "Email already registered"}), 409
        return jsonify({"error": "Registration failed"}), 500
    finally:
        cursor.close()
        conn.close()
```

---

## Login Endpoint + JWT

Add a `SECRET_KEY` to your `.env`:
```
SECRET_KEY=change_this_to_a_long_random_string
```

```python
import jwt
import os
from datetime import datetime, timedelta

@app.route("/api/auth/login", methods=["POST"])
def login():
    data     = request.get_json()
    email    = data.get("email")
    password = data.get("password")

    conn   = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    is_valid = bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8"))
    if not is_valid:
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": user["id"],
        "email":   user["email"],
        "exp":     datetime.utcnow() + timedelta(hours=24),
    }, os.getenv("SECRET_KEY"), algorithm="HS256")

    return jsonify({"token": token})
```

---

## Protecting Endpoints

Create a decorator that checks the token before allowing access:

```python
from functools import wraps

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Token required"}), 401
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            request.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

# Use it on any endpoint
@app.route("/api/profile")
@require_auth
def profile():
    return jsonify({"user": request.user})
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Storing plaintext passwords | Catastrophic data breach | Always hash with bcrypt |
| Short or guessable `SECRET_KEY` | Tokens forged | Use a long random string (32+ chars) |
| No token expiry | Stolen tokens are valid forever | Always set `exp` |
| Same error message for wrong email vs wrong password | Leaks whether the email exists | Always return "Invalid credentials" for both |

---

## Checkpoint

- [ ] You can register a user with a hashed password
- [ ] You can log in and receive a JWT token
- [ ] You protected an endpoint with `@require_auth`
- [ ] You understand why passwords must be hashed

---

**Next lesson:** [13 — Structuring a Flask App](./13-structuring-a-flask-app)
