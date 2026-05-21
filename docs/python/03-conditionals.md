---
sidebar_position: 4
---

# 03 — Conditionals

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** make your program take different paths based on conditions using `if`, `elif`, and `else`.

---

## The Hook

Every useful program makes decisions.

*If the user is logged in, show the dashboard. Otherwise, show the login page.*  
*If the stock is 0, show "out of stock". If it is under 10, show "low stock". Otherwise show the count.*

That logic is called a **conditional** — code that runs only when a condition is true.

---

## Basic if / else

```python
age = 20

if age >= 18:
    print("Access granted")
else:
    print("Access denied")
```

The `:` at the end of `if` and `else` is required.  
The indented code (4 spaces) only runs if the condition is true.

**Indentation is not optional in Python.** It is how Python knows what belongs inside the `if`.

---

## elif — Multiple Conditions

```python
stock = 5

if stock == 0:
    print("Out of stock")
elif stock < 10:
    print("Low stock — only " + str(stock) + " left")
else:
    print("In stock: " + str(stock))
```

Python checks conditions top to bottom and stops at the first true one.

---

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal to | `age == 18` |
| `!=` | Not equal | `status != "cancelled"` |
| `>` | Greater than | `price > 100` |
| `<` | Less than | `stock < 10` |
| `>=` | Greater or equal | `age >= 18` |
| `<=` | Less or equal | `balance <= 0` |

:::warning
`=` assigns a value. `==` compares. Mixing them up is one of the most common beginner bugs.
:::

---

## Combining Conditions

```python
age = 22
has_id = True

if age >= 18 and has_id:
    print("Welcome")

if age < 13 or age > 65:
    print("Special pricing applies")

if not has_id:
    print("ID required")
```

| Operator | Meaning |
|----------|---------|
| `and` | Both must be true |
| `or` | At least one must be true |
| `not` | Reverses the condition |

---

## Checking Strings

```python
status = "pending"

if status == "pending":
    print("Waiting for payment")
elif status == "shipped":
    print("On the way")
elif status == "delivered":
    print("Arrived")
else:
    print("Unknown status")
```

---

## Truthy and Falsy

In Python, values that are "empty" or "zero" count as `False` in a condition:

| Value | Treated as |
|-------|-----------|
| `0` | False |
| `""` (empty string) | False |
| `None` | False |
| `[]` (empty list) | False |
| Everything else | True |

```python
name = ""

if name:
    print(f"Hello, {name}")
else:
    print("No name provided")
```

This is a very common Python pattern — check if something exists before using it.

---

## Predict Before You Run

```python
x = 10
y = 20

if x > 5 and y < 15:
    print("A")
elif x > 5 or y < 15:
    print("B")
else:
    print("C")
```

What prints? Why?

<details>
<summary>Show answer</summary>

**B**

First condition: `x > 5` is True, but `y < 15` is False → `True and False` = False → skip  
Second condition: `x > 5` is True → `True or False` = True → print "B"  
Never reaches "C"

</details>

---

## Break It

Find the bug:

```python
price = 500

if price = 500:
    print("Standard price")
```

<details>
<summary>Answer</summary>

`=` is assignment, not comparison. Use `==`:

```python
if price == 500:
    print("Standard price")
```

</details>

---

## Build On It

Write a program that checks a product's stock level and prints the right message:
- stock is 0 → `"Sold out"`
- stock is 1 to 5 → `"Almost gone — X left"` (show the actual number)
- stock is 6 to 20 → `"Limited stock"`
- stock is above 20 → `"Available"`

Test it with stock values of `0`, `3`, `15`, and `50`.

<details>
<summary>Show answer</summary>

```python
stock = 3

if stock == 0:
    print("Sold out")
elif stock <= 5:
    print(f"Almost gone — {stock} left")
elif stock <= 20:
    print("Limited stock")
else:
    print("Available")
```

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `if age = 18:` | `SyntaxError` | Use `==` for comparison |
| Missing `:` after condition | `SyntaxError` | `if condition:` — colon is required |
| Wrong indentation | `IndentationError` | Use exactly 4 spaces per level |
| Checking `None` with `==` | Works but not idiomatic | Use `if value is None:` |

---

## When Things Go Wrong

**`IndentationError: expected an indented block`**  
The body of your `if` is missing or not indented. Add 4 spaces before the code inside the block.

**`SyntaxError: invalid syntax` on the `if` line**  
Usually a missing `:` at the end of the condition.

---

## Checkpoint

- [ ] You wrote an `if / elif / else` block
- [ ] You combined conditions with `and` and `or`
- [ ] You predicted the output correctly
- [ ] You completed the stock-level challenge
- [ ] You understand truthy and falsy values

---

**Next lesson:** [04 — Loops](./04-loops)
