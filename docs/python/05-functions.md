---
sidebar_position: 6
---

# 05 — Functions

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** write reusable functions, pass data in with parameters, get data back with return values, and use default parameters.

---

## The Hook

You have written the same calculation three times in different places.  
Now the formula changes — and you have to find and update all three.

A **function** solves this. You write the logic once, give it a name, and call it from anywhere. Change it once — it updates everywhere.

---

## Defining and Calling a Function

```python
def greet():
    print("Hello, welcome to the store!")

greet()  # call the function
greet()  # call it again
```

`def` defines the function. The name is `greet`. The `:` starts the body. Indented lines belong to the function.

---

## Parameters — Passing Data In

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
greet("Brian")
```

Output:
```
Hello, Alice!
Hello, Brian!
```

`name` is a parameter — a variable that receives a value when the function is called.

Multiple parameters:

```python
def calculate_total(price, quantity):
    total = price * quantity
    print(f"Total: KES {total:.2f}")

calculate_total(150, 3)   # Total: KES 450.00
calculate_total(850, 1)   # Total: KES 850.00
```

---

## return — Getting Data Back

A function that only prints is limited. A function that **returns** a value can be used in calculations, saved to a variable, or passed to other functions.

```python
def calculate_total(price, quantity):
    return price * quantity

total = calculate_total(150, 3)
print(f"You owe KES {total:.2f}")

# Can use in an expression directly
print(f"With tax: KES {calculate_total(150, 3) * 1.16:.2f}")
```

A function without a `return` statement returns `None`.

---

## Default Parameters

Set a default value for a parameter — used when the caller does not provide one:

```python
def greet(name, message="Welcome to our store"):
    print(f"Hello, {name}. {message}")

greet("Alice")                         # uses default message
greet("Brian", "Your order is ready")  # overrides default
```

Output:
```
Hello, Alice. Welcome to our store
Hello, Brian. Your order is ready
```

Default parameters must come after non-default ones.

---

## Keyword Arguments

Call a function by naming the parameters — order does not matter:

```python
def create_user(name, email, age):
    print(f"Created: {name} ({email}), age {age}")

create_user(email="alice@email.com", age=24, name="Alice")
```

---

## Predict Before You Run

```python
def double(n):
    return n * 2

def add(a, b):
    return a + b

result = add(double(3), double(5))
print(result)
```

What does this print?

<details>
<summary>Show answer</summary>

`16`

`double(3)` = 6, `double(5)` = 10, `add(6, 10)` = 16

</details>

---

## Fill in the Blank

Write a function `apply_discount` that takes a `price` and a `discount_percent`, and returns the discounted price. A 10% discount on 850 should return 765.0.

```python
def apply_discount(___, ___):
    discount_amount = price * (___ / ___)
    return ___ - ___

print(apply_discount(850, 10))   # 765.0
print(apply_discount(150, 20))   # 120.0
```

<details>
<summary>Show answer</summary>

```python
def apply_discount(price, discount_percent):
    discount_amount = price * (discount_percent / 100)
    return price - discount_amount

print(apply_discount(850, 10))   # 765.0
print(apply_discount(150, 20))   # 120.0
```

</details>

---

## Break It

What is wrong here?

```python
def get_price():
    price = 150

result = get_price()
print(result + 50)
```

<details>
<summary>Answer</summary>

The function has no `return` statement so it returns `None`.  
`None + 50` causes a `TypeError`.

Fix:
```python
def get_price():
    return 150
```

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Forgetting `return` | Function returns `None` | Add `return value` |
| Calling before defining | `NameError` | Define functions before calling them (or at top of file) |
| Confusing `print` and `return` | Value is displayed but not usable | Use `return` when you need the value, `print` only for display |
| Default param before required param | `SyntaxError` | Required params first: `def f(a, b=10):` not `def f(b=10, a):` |

---

## When Things Go Wrong

**`TypeError: function() takes 2 positional arguments but 3 were given`**  
You called the function with more arguments than it has parameters. Count them.

**`NameError: name 'my_function' is not defined`**  
The function is either not defined yet, or you misspelled the name.

---

## Checkpoint

- [ ] You wrote a function with no parameters
- [ ] You wrote a function with parameters and a return value
- [ ] You used a default parameter
- [ ] You predicted the output correctly
- [ ] You completed `apply_discount`

---

**Next lesson:** [06 — Lists and Dictionaries](./06-lists-and-dictionaries)
