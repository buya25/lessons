---
sidebar_position: 5
---

# 04 — Loops

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** repeat code with `for` and `while` loops, control loop flow with `break` and `continue`, and loop over lists and ranges.

---

## The Hook

You have a list of 1,000 products and need to print each one.  
You are not going to write 1,000 `print()` statements.

A **loop** repeats a block of code — either for each item in a collection, or as long as a condition is true.

---

## for Loop — Iterate Over a Sequence

```python
products = ["Notebook", "Pen", "Backpack"]

for product in products:
    print(product)
```

Output:
```
Notebook
Pen
Backpack
```

On each loop, `product` holds the current item. Python moves through the list automatically.

---

## range() — Loop a Specific Number of Times

```python
for i in range(5):
    print(i)
```

Output: `0 1 2 3 4` — range starts at 0 and stops before 5.

```python
for i in range(1, 6):
    print(i)
```

Output: `1 2 3 4 5`

```python
for i in range(0, 10, 2):
    print(i)
```

Output: `0 2 4 6 8` — counts by 2.

---

## while Loop — Repeat While a Condition is True

```python
stock = 5

while stock > 0:
    print(f"Selling one item. Stock: {stock}")
    stock = stock - 1

print("Sold out")
```

Output:
```
Selling one item. Stock: 5
Selling one item. Stock: 4
Selling one item. Stock: 3
Selling one item. Stock: 2
Selling one item. Stock: 1
Sold out
```

:::danger
If the condition never becomes False, the loop runs forever — this is called an **infinite loop**.  
Always make sure something inside the loop changes the condition.
:::

---

## break — Exit the Loop Early

```python
prices = [150, 20, 850, 500, 75]

for price in prices:
    if price > 400:
        print(f"Found expensive item: {price}")
        break  # stop the loop immediately

print("Done")
```

Output:
```
Found expensive item: 850
Done
```

---

## continue — Skip the Current Iteration

```python
for i in range(1, 6):
    if i == 3:
        continue  # skip 3, keep going
    print(i)
```

Output: `1 2 4 5` — 3 is skipped.

---

## enumerate() — Loop With an Index

When you need both the position and the value:

```python
products = ["Notebook", "Pen", "Backpack"]

for index, product in enumerate(products):
    print(f"{index + 1}. {product}")
```

Output:
```
1. Notebook
2. Pen
3. Backpack
```

---

## Predict Before You Run

```python
total = 0
numbers = [10, 20, 30, 40, 50]

for n in numbers:
    if n == 30:
        continue
    total = total + n

print(total)
```

What does this print?

<details>
<summary>Show answer</summary>

`120`

Adds 10 + 20 + 40 + 50 = 120. Skips 30 because of `continue`.

</details>

---

## Fill in the Blank

Complete this loop to print only products with a price under 200:

```python
products = [
    {"name": "Notebook", "price": 150},
    {"name": "Pen",      "price": 20},
    {"name": "Backpack", "price": 850},
]

for product in ___:
    if product[___] < ___:
        print(product[___])
```

<details>
<summary>Show answer</summary>

```python
for product in products:
    if product["price"] < 200:
        print(product["name"])
```

Output:
```
Notebook
Pen
```

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Missing `:` after `for`/`while` | `SyntaxError` | `for x in items:` |
| Infinite `while` loop | Program freezes | Make sure the condition eventually becomes False |
| Modifying a list while looping over it | Skipped items or errors | Loop over a copy: `for item in items[:]` |
| `range(5)` when you expect `1–5` | Gets `0–4` | Use `range(1, 6)` for 1 to 5 inclusive |

---

## When Things Go Wrong

**Program is frozen / not responding**  
You have an infinite loop. Press `Ctrl + C` in the terminal to stop it. Then find the `while` condition that never becomes False.

**`TypeError: 'int' object is not iterable`**  
You tried to loop over a number. `for i in 5:` does not work — use `for i in range(5):`.

---

## Checkpoint

- [ ] You looped over a list with `for`
- [ ] You used `range()` with start, stop, and step
- [ ] You wrote a `while` loop that ends naturally
- [ ] You used `break` and `continue`
- [ ] You predicted the output correctly
- [ ] You completed the fill-in-the-blank

---

**Next lesson:** [05 — Functions](./05-functions)
