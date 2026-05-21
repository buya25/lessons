---
sidebar_position: 15
---

# 14 — Input Validation

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** validate user input before it reaches the database, and return clear, consistent error messages.

---

## The Hook

A user sends `{"price": "not a number"}` to your create-product endpoint.  
Without validation, this crashes your app or inserts garbage into the database.

**Never trust input from the outside world.** Every value coming in from a request must be checked.

---

## What to Validate

For every incoming field, ask:
1. Is it present? (required fields)
2. Is it the right type? (string, number, boolean)
3. Is it within acceptable range? (age >= 0, price >= 0)
4. Is it the right format? (valid email, valid date)
5. Is it a safe length? (not 50,000 characters)

---

## A Validation Helper

Write a reusable validator instead of repeating `if/else` everywhere:

```python
def validate(data, rules):
    errors = {}

    for field, rule in rules.items():
        value = data.get(field)

        # required check
        if rule.get("required") and value is None:
            errors[field] = f"{field} is required"
            continue

        if value is None:
            continue  # optional field, no value — skip remaining checks

        # type check
        expected_type = rule.get("type")
        if expected_type and not isinstance(value, expected_type):
            errors[field] = f"{field} must be a {expected_type.__name__}"
            continue

        # min / max for numbers
        if "min" in rule and value < rule["min"]:
            errors[field] = f"{field} must be at least {rule['min']}"
        if "max" in rule and value > rule["max"]:
            errors[field] = f"{field} must be at most {rule['max']}"

        # min_length / max_length for strings
        if "min_length" in rule and len(str(value)) < rule["min_length"]:
            errors[field] = f"{field} must be at least {rule['min_length']} characters"
        if "max_length" in rule and len(str(value)) > rule["max_length"]:
            errors[field] = f"{field} must be at most {rule['max_length']} characters"

    return errors
```

---

## Using the Validator

```python
@products_bp.route("/", methods=["POST"])
def create():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    rules = {
        "name":  {"required": True, "type": str,   "max_length": 100},
        "price": {"required": True, "type": (int, float), "min": 0},
        "stock": {"required": False, "type": int,  "min": 0},
    }

    errors = validate(data, rules)
    if errors:
        return jsonify({"errors": errors}), 400

    # safe to use data now
    name  = data["name"].strip()
    price = float(data["price"])
    stock = data.get("stock", 0)
    ...
```

---

## Email Validation

```python
import re

def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))

if not is_valid_email(data.get("email", "")):
    return jsonify({"error": "Invalid email format"}), 400
```

---

## Consistent Error Response Format

Pick a format and use it everywhere — your frontend depends on it being consistent:

```json
{
  "errors": {
    "name": "name is required",
    "price": "price must be at least 0"
  }
}
```

Or for a single error:

```json
{
  "error": "Product not found"
}
```

Single error → `"error"` (string). Multiple errors → `"errors"` (object). Always.

---

## Password Validation

```python
def validate_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters"
    if not any(c.isupper() for c in password):
        return "Password must contain at least one uppercase letter"
    if not any(c.isdigit() for c in password):
        return "Password must contain at least one number"
    return None

error = validate_password(data.get("password", ""))
if error:
    return jsonify({"error": error}), 400
```

---

## Predict Before You Run

Given this validation call:

```python
data = {"name": "AB", "price": -5}
rules = {
    "name":  {"required": True,  "type": str, "min_length": 3},
    "price": {"required": True,  "type": (int, float), "min": 0},
    "stock": {"required": False, "type": int},
}
errors = validate(data, rules)
print(errors)
```

What do you expect `errors` to contain?

<details>
<summary>Answer</summary>

```python
{
    "name":  "name must be at least 3 characters",
    "price": "price must be at least 0"
}
```

`stock` is optional and not provided — no error for it.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Validating after database call | Garbage data in DB, wasted query | Always validate before touching the database |
| Different error formats per endpoint | Frontend cannot handle errors consistently | Use one error format across the entire API |
| Trusting `Content-Type` header | User can lie about content type | Always call `request.get_json(silent=True)` and check for `None` |
| No length limits on text fields | 50,000-character names inserted | Always set `max_length` on string fields |

---

## Checkpoint

- [ ] You have a reusable `validate()` function
- [ ] The create-product endpoint uses it and returns clear errors
- [ ] You validated email format with a regex
- [ ] You validated password strength
- [ ] Error responses are consistent across endpoints

---

**Next lesson:** [15 — Testing Your API](./15-testing-your-api)
