---
sidebar_position: 3
---

# 02 — Variables and Data Types

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** store values in variables, identify Python's core data types, and convert between them.

---

## The Hook

Every program needs to remember things.  
A variable is a name that holds a value — like a labelled box.

```python
price = 850
name = "Backpack"
in_stock = True
```

The label is `price`, `name`, `in_stock`. The value is what is inside.

---

## Creating Variables

In Python you do not declare a type — you just assign:

```python
age = 24
username = "alice"
balance = 1499.99
is_active = True
```

Rules for variable names:
- Lowercase with underscores: `user_name`, `total_price`
- No spaces, no starting with a number
- No Python keywords (`if`, `for`, `True`, etc.)

---

## The Core Data Types

| Type | Example | What it stores |
|------|---------|---------------|
| `int` | `42` | Whole numbers |
| `float` | `19.99` | Decimal numbers |
| `str` | `"hello"` | Text |
| `bool` | `True` / `False` | True or false |
| `None` | `None` | Nothing / no value |

Check the type of any value:

```python
print(type(42))        # <class 'int'>
print(type("hello"))   # <class 'str'>
print(type(3.14))      # <class 'float'>
print(type(True))      # <class 'bool'>
```

---

## Strings in Detail

Strings are text. Use single or double quotes — both work:

```python
name = 'Alice'
city = "Nairobi"
```

**Joining strings (concatenation):**

```python
greeting = "Hello, " + name
print(greeting)  # Hello, Alice
```

**f-strings — the cleaner way (use this always):**

```python
name = "Alice"
age = 24
print(f"Hello, {name}. You are {age} years old.")
# Hello, Alice. You are 24 years old.
```

The `f` before the quote turns it into an f-string. Anything inside `{}` is evaluated as code.

**Useful string operations:**

```python
text = "  Hello, World!  "

print(text.upper())        # "  HELLO, WORLD!  "
print(text.lower())        # "  hello, world!  "
print(text.strip())        # "Hello, World!"  (removes whitespace)
print(text.replace("World", "Python"))  # "  Hello, Python!  "
print(len(text))           # 18 (counts every character including spaces)
```

---

## Numbers

```python
a = 10
b = 3

print(a + b)   # 13  addition
print(a - b)   # 7   subtraction
print(a * b)   # 30  multiplication
print(a / b)   # 3.3333...  division (always returns float)
print(a // b)  # 3   integer division (floor)
print(a % b)   # 1   remainder (modulo)
print(a ** b)  # 1000  power (10 to the power of 3)
```

---

## Type Conversion

Convert between types when needed:

```python
# String to number
price_text = "850"
price = int(price_text)
print(price + 100)  # 950

# Number to string
age = 24
message = "Age: " + str(age)
print(message)  # Age: 24

# String to float
amount = float("19.99")
print(amount * 2)  # 39.98
```

---

## Predict Before You Run

What does each line print? Write your answers first.

```python
x = "5"
y = 3

print(x * y)
print(int(x) * y)
print(x + str(y))
print(len(x))
```

<details>
<summary>Show answers</summary>

```
555
15
53
1
```

Line 1: `"5" * 3` repeats the string 3 times → `"555"`  
Line 2: `int("5") * 3` = `5 * 3` → `15`  
Line 3: `"5" + "3"` concatenates strings → `"53"`  
Line 4: `len("5")` counts characters in the string → `1`

</details>

---

## None — The Absence of a Value

`None` means "nothing is here yet". It is not zero, not empty string — it is the absence of any value.

```python
result = None
print(result)        # None
print(result is None)  # True
```

You will see `None` often when a function returns nothing, or when a value has not been set yet. It is Python's equivalent of SQL's `NULL`.

---

## Fill in the Blank

Complete the code so it prints: `"Product: Backpack | Price: KES 850.00"`

```python
product_name = "Backpack"
price = 850

output = f"Product: ___ | Price: KES ___"
print(output)
```

<details>
<summary>Show answer</summary>

```python
product_name = "Backpack"
price = 850

output = f"Product: {product_name} | Price: KES {price:.2f}"
print(output)
```

`{price:.2f}` formats the number to 2 decimal places.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `"Age: " + 24` | `TypeError: can only concatenate str` | Convert: `"Age: " + str(24)` or use f-string |
| `int("19.99")` | `ValueError: invalid literal for int()` | Use `float("19.99")` then `int()` if needed |
| Forgetting `f` before an f-string | `{name}` printed literally | Write `f"Hello {name}"` not `"Hello {name}"` |
| Using `==` to compare with `None` | Works but not idiomatic | Use `is None` and `is not None` |

---

## When Things Go Wrong

**`TypeError: unsupported operand type(s) for +: 'int' and 'str'`**  
You tried to add a number and a string. Convert one of them first.

**`NameError: name 'username' is not defined`**  
You used a variable before assigning it, or you made a typo in the name. Python is case-sensitive — `Username` and `username` are different.

---

## Checkpoint

- [ ] You created variables of each type: int, float, str, bool, None
- [ ] You used an f-string to build a sentence
- [ ] You converted a string to an int and back
- [ ] You predicted all four outputs correctly

---

**Next lesson:** [03 — Conditionals](./03-conditionals)
