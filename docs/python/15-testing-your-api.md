---
sidebar_position: 16
---

# 15 — Testing Your API

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** write automated tests for your Flask API endpoints using pytest.

---

## The Hook

Right now you test your API by manually opening Postman or a browser.  
That works once. But after every change you would need to re-test everything manually.

Automated tests do this for you in seconds. Write the test once — run it forever.

---

## Install pytest

```bash
pip install pytest
```

---

## Flask Test Client

Flask comes with a built-in test client — a fake HTTP client that calls your routes without needing a running server:

```python
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client
```

A **fixture** is a reusable setup function. `client` is available in any test that lists it as a parameter.

---

## Your First Tests

Create `tests/test_products.py`:

```python
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c

def test_get_products_returns_200(client):
    response = client.get("/api/products")
    assert response.status_code == 200

def test_get_products_returns_list(client):
    response = client.get("/api/products")
    data = response.get_json()
    assert isinstance(data, list)

def test_get_nonexistent_product_returns_404(client):
    response = client.get("/api/products/99999")
    assert response.status_code == 404

def test_create_product_missing_fields(client):
    response = client.post("/api/products",
        json={"name": "Test"},  # price is missing
        content_type="application/json"
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "errors" in data or "error" in data

def test_create_product_negative_price(client):
    response = client.post("/api/products",
        json={"name": "Bad Product", "price": -50},
        content_type="application/json"
    )
    assert response.status_code == 400
```

Run tests:

```bash
pytest
```

Or with more detail:

```bash
pytest -v
```

---

## What Good Tests Check

| Test type | What it checks |
|-----------|---------------|
| **Happy path** | The normal case works |
| **Missing input** | Required fields absent → 400 |
| **Invalid input** | Wrong type/range → 400 |
| **Not found** | Non-existent resource → 404 |
| **Duplicate** | Unique constraint violation → 409 |

Write at least one of each type for every endpoint.

---

## Testing Authentication

```python
def test_login_with_wrong_password(client):
    response = client.post("/api/auth/login",
        json={"email": "alice@email.com", "password": "wrongpassword"},
        content_type="application/json"
    )
    assert response.status_code == 401

def test_protected_endpoint_without_token(client):
    response = client.get("/api/profile")
    assert response.status_code == 401

def test_protected_endpoint_with_valid_token(client):
    # Login first to get a token
    login = client.post("/api/auth/login",
        json={"email": "alice@email.com", "password": "correctpassword"},
        content_type="application/json"
    )
    token = login.get_json()["token"]

    # Use the token
    response = client.get("/api/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
```

---

## pytest.ini — Project Configuration

Create `pytest.ini` at the root:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Testing against the real database | Tests modify production data | Use a separate test database or mock the DB |
| No assertions | Tests always pass | Every test must `assert` something |
| Testing implementation instead of behaviour | Tests break on refactor | Test what the endpoint returns, not how it works internally |
| Only testing happy paths | Bugs in error handling go unnoticed | Always test the failure cases |

---

## When Things Go Wrong

**`ModuleNotFoundError: No module named 'app'`**  
Run pytest from the root of your project, not from inside `tests/`. Or add a `conftest.py` to the root.

**Tests pass locally but fail in CI**  
Usually environment variables. Make sure `TEST_` prefixed env vars are set in your CI config.

---

## Checkpoint

- [ ] pytest is installed
- [ ] You have at least 5 tests covering happy and failure paths
- [ ] All tests pass: `pytest -v` shows green
- [ ] You tested at least one protected endpoint

---

**Next:** [Project — E-commerce REST API](./project-rest-api)
