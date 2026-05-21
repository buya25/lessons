---
sidebar_position: 7
---

# 06 — Lists and Dictionaries

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** store collections of data in lists and dictionaries, access and modify them, and loop through them.

---

## The Hook

A variable holds one value. But what if you need to store 50 products?

You could write `product1`, `product2`, `product3`... and repeat every piece of code 50 times.  
Or you could use a **list** — a single variable that holds many values.

And when a product has a name, price, and stock — a **dictionary** holds all that together.

---

## Lists

A list holds multiple values in order:

```python
products = ["Notebook", "Pen", "Backpack"]
prices   = [150, 20, 850]
mixed    = ["Alice", 24, True, None]  # can mix types, but rarely a good idea
```

**Access by index** (starts at 0):

```python
print(products[0])   # Notebook
print(products[1])   # Pen
print(products[-1])  # Backpack (last item)
```

**Modify:**

```python
products[1] = "Ruler"
print(products)  # ['Notebook', 'Ruler', 'Backpack']
```

**Add and remove:**

```python
products.append("Eraser")       # add to end
products.insert(0, "Stapler")   # insert at position 0
products.remove("Ruler")        # remove by value
products.pop()                  # remove last item
products.pop(0)                 # remove by index
```

**Useful operations:**

```python
print(len(products))            # number of items
print("Notebook" in products)   # True/False
print(sorted(prices))           # [20, 150, 850]
print(sum(prices))              # 1020
```

---

## Slicing — Get a Portion of a List

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[1:4])    # [20, 30, 40]  — from index 1 up to (not including) 4
print(numbers[:3])     # [10, 20, 30]  — from start up to index 3
print(numbers[2:])     # [30, 40, 50]  — from index 2 to end
print(numbers[::-1])   # [50, 40, 30, 20, 10]  — reversed
```

---

## Dictionaries

A dictionary holds **key-value pairs** — like a real dictionary where you look up a word (key) to get its meaning (value):

```python
product = {
    "name":  "Backpack",
    "price": 850,
    "stock": 45,
}
```

**Access by key:**

```python
print(product["name"])    # Backpack
print(product["price"])   # 850
```

**Safe access with .get() — no error if key missing:**

```python
print(product.get("colour"))          # None
print(product.get("colour", "N/A"))   # N/A
```

**Modify and add:**

```python
product["price"] = 900          # update existing
product["category"] = "bags"    # add new key
del product["stock"]            # delete key
```

**Check key exists:**

```python
if "price" in product:
    print("Price is set")
```

---

## List of Dictionaries — How Real Data Looks

In a real app, your data is not flat strings — it is structured:

```python
products = [
    {"id": 1, "name": "Notebook", "price": 150, "stock": 200},
    {"id": 2, "name": "Pen",      "price": 20,  "stock": 500},
    {"id": 3, "name": "Backpack", "price": 850, "stock": 45},
]

for product in products:
    print(f"{product['name']:15} KES {product['price']:.2f}")
```

This is exactly the structure your Python API will return from the database.

---

## Predict Before You Run

```python
items = [3, 1, 4, 1, 5, 9, 2, 6]

print(items[0])
print(items[-1])
print(items[2:5])
print(len(items))
print(sum(items))
```

<details>
<summary>Show answers</summary>

```
3
6
[4, 1, 5]
8
31
```

</details>

---

## Fill in the Blank

Write a function that takes a list of product dictionaries and returns a new list containing only the names of products with a price under 200.

```python
def cheap_products(products):
    result = []
    for product in ___:
        if product[___] < ___:
            result.___(product[___])
    return result

products = [
    {"name": "Notebook", "price": 150},
    {"name": "Pen",      "price": 20},
    {"name": "Backpack", "price": 850},
]

print(cheap_products(products))  # ['Notebook', 'Pen']
```

<details>
<summary>Show answer</summary>

```python
def cheap_products(products):
    result = []
    for product in products:
        if product["price"] < 200:
            result.append(product["name"])
    return result
```

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Accessing an index that does not exist | `IndexError: list index out of range` | Check `len(list)` before accessing |
| Accessing a key that does not exist | `KeyError` | Use `.get("key")` for safe access |
| `list[-1]` confusion | Not an error — returns last item | This is intentional Python syntax |
| Modifying a list while looping over it | Skipped items | Loop over a copy: `for item in list[:]` |

---

## When Things Go Wrong

**`IndexError: list index out of range`**  
You accessed an index beyond the list length. A list with 3 items has indexes 0, 1, 2 — not 3.

**`KeyError: 'name'`**  
The key does not exist in the dictionary. Check spelling or use `.get()`.

---

## Checkpoint

- [ ] You created a list and accessed items by index
- [ ] You added and removed items from a list
- [ ] You created a dictionary and accessed values by key
- [ ] You looped over a list of dictionaries
- [ ] You completed the `cheap_products` function

---

**Next lesson:** [07 — Error Handling](./07-error-handling)
