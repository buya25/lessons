---
sidebar_position: 8
---

# 07 — Error Handling

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** catch and handle errors gracefully so your program does not crash when something unexpected happens.

---

## The Hook

Your API receives a product ID from a user. You look it up in the database. It does not exist.

Without error handling: your program crashes with an ugly error message.  
With error handling: your API sends back a clean `"Product not found"` response.

Errors are not failures — they are expected events that your code must handle.

---

## Reading Error Messages

Before handling errors, learn to read them. Python error messages are precise:

```
Traceback (most recent call last):
  File "app.py", line 5, in <module>
    result = 10 / 0
ZeroDivisionError: division by zero
```

- **File and line number** — where the error happened
- **Error type** — `ZeroDivisionError` — what kind of error it is
- **Message** — `division by zero` — what went wrong

Always read the last line first.

---

## try / except — Catch an Error

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
```

The code in `try` runs normally. If it raises a `ZeroDivisionError`, execution jumps to `except` — the crash never happens.

---

## Catching Different Error Types

```python
def get_product(products, index):
    try:
        return products[index]
    except IndexError:
        return None

products = ["Notebook", "Pen"]
print(get_product(products, 0))   # Notebook
print(get_product(products, 5))   # None (no crash)
```

Handle multiple error types:

```python
try:
    value = int(input("Enter a number: "))
    result = 100 / value
    print(result)
except ValueError:
    print("That is not a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
```

---

## The Exception Object — Getting the Message

```python
try:
    result = int("not_a_number")
except ValueError as e:
    print(f"Error: {e}")
    # Error: invalid literal for int() with base 10: 'not_a_number'
```

The `as e` gives you the error object — useful for logging.

---

## else and finally

```python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print(f"Result: {result}")   # runs only if no exception
finally:
    print("This always runs")    # runs whether error or not
```

Output:
```
Result: 5.0
This always runs
```

`finally` is used for cleanup — closing a file, closing a database connection — regardless of whether an error occurred.

---

## Raising Your Own Errors

You can raise an error intentionally to signal that something is wrong:

```python
def set_stock(quantity):
    if quantity < 0:
        raise ValueError("Stock cannot be negative")
    return quantity

try:
    set_stock(-5)
except ValueError as e:
    print(f"Invalid input: {e}")
```

This is how your API will signal bad user input.

---

## Predict Before You Run

```python
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return 0

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide("ten", 2))
```

What does each line print?

<details>
<summary>Show answers</summary>

```
5.0
0
```

Then a crash: `TypeError: unsupported operand type(s) for /: 'str' and 'int'`

The function only catches `ZeroDivisionError` — a `TypeError` is not caught and propagates up.

To fix, add `except TypeError: return 0` or catch the general `Exception`.

</details>

---

## Common Error Types to Know

| Error | When it happens |
|-------|----------------|
| `ValueError` | Wrong type of value (e.g. `int("hello")`) |
| `TypeError` | Wrong type for an operation (e.g. `"a" + 1`) |
| `KeyError` | Dictionary key does not exist |
| `IndexError` | List index out of range |
| `ZeroDivisionError` | Division by zero |
| `FileNotFoundError` | File does not exist |
| `AttributeError` | Method/attribute does not exist on object |

---

## Fill in the Blank

Complete the function so it returns the product price as a float, or returns `None` if the product is not found:

```python
def get_price(products, product_name):
    ___:
        product = next(p for p in products if p["name"] == product_name)
        return float(product["price"])
    except ___:
        return None

products = [{"name": "Notebook", "price": "150"}]
print(get_price(products, "Notebook"))  # 150.0
print(get_price(products, "Chair"))     # None
```

<details>
<summary>Show answer</summary>

```python
def get_price(products, product_name):
    try:
        product = next(p for p in products if p["name"] == product_name)
        return float(product["price"])
    except StopIteration:
        return None
```

`next()` raises `StopIteration` when no match is found.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Catching `Exception` for everything | Hides real bugs | Catch specific errors; only use `Exception` for logging |
| Empty `except` block | Silently swallows errors | At minimum, log the error: `print(e)` |
| Raising a generic `Exception` | Unclear what went wrong | Use specific types: `ValueError`, `TypeError` etc. |

---

## When Things Go Wrong

**Your `except` block never runs even though an error occurs**  
You are catching the wrong error type. Read the traceback to see the actual error class, then match it in your `except`.

---

## Checkpoint

- [ ] You caught a `ZeroDivisionError` with `try/except`
- [ ] You caught multiple different error types separately
- [ ] You raised a `ValueError` with a custom message
- [ ] You used `finally` to run cleanup code
- [ ] You completed the fill-in-the-blank

---

**Next lesson:** [08 — Modules and Packages](./08-modules-and-packages)
