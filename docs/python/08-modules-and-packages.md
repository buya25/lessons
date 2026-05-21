---
sidebar_position: 9
---

# 08 — Modules and Packages

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** import and use Python's built-in modules, install third-party packages with pip, and split your own code across multiple files.

---

## The Hook

You do not have to write everything from scratch.  
Python comes with hundreds of built-in modules — pre-written code for dates, maths, file handling, networking, and much more.

And beyond that, thousands of packages built by developers worldwide are available to install in seconds.

---

## Importing a Module

```python
import math

print(math.sqrt(16))    # 4.0
print(math.pi)          # 3.14159...
print(math.floor(3.9))  # 3
print(math.ceil(3.1))   # 4
```

Import specific items (cleaner if you only need a few):

```python
from math import sqrt, pi

print(sqrt(25))   # 5.0
print(pi)         # 3.14159...
```

Give a module a shorter alias:

```python
import datetime as dt

today = dt.date.today()
print(today)  # 2026-05-21
```

---

## Useful Built-in Modules

### datetime — Working With Dates

```python
from datetime import datetime, date, timedelta

now   = datetime.now()
today = date.today()

print(now.strftime("%Y-%m-%d %H:%M"))  # 2026-05-21 14:30
print(today)                           # 2026-05-21

tomorrow   = today + timedelta(days=1)
last_week  = today - timedelta(days=7)
```

### random — Random Values

```python
import random

print(random.randint(1, 100))          # random int between 1 and 100
print(random.choice(["a", "b", "c"]))  # random item from list
random.shuffle([1, 2, 3, 4, 5])        # shuffles list in place
```

### json — Read and Write JSON

```python
import json

# Python dict to JSON string
product = {"name": "Notebook", "price": 150}
json_string = json.dumps(product)
print(json_string)  # '{"name": "Notebook", "price": 150}'

# JSON string back to Python dict
data = json.loads('{"name": "Notebook", "price": 150}')
print(data["name"])  # Notebook
```

JSON is the format your API will use to send and receive data.

---

## pip — Installing Third-Party Packages

`pip` is Python's package manager. Open a terminal and run:

```bash
pip install requests
```

Now use it:

```python
import requests

response = requests.get("https://api.github.com")
print(response.status_code)   # 200
print(response.json()["current_user_url"])
```

For this course, the key packages you will install:

```bash
pip install flask         # web framework for your API
pip install mysql-connector-python  # connect Python to MySQL
pip install python-dotenv # manage environment variables
```

---

## Virtual Environments — Keeping Projects Clean

Different projects need different package versions. A virtual environment keeps them isolated.

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Now install packages — they only apply to this project
pip install flask

# Save what is installed
pip freeze > requirements.txt

# Deactivate when done
deactivate
```

`requirements.txt` lets other developers install exactly what your project needs:

```bash
pip install -r requirements.txt
```

Always create a virtual environment before starting a new Python project.

---

## Splitting Code Across Files

As projects grow, one file becomes unmanageable. Split code into modules:

**products.py:**
```python
def get_all_products():
    return [
        {"id": 1, "name": "Notebook", "price": 150},
        {"id": 2, "name": "Pen",      "price": 20},
    ]

def find_product(product_id):
    products = get_all_products()
    return next((p for p in products if p["id"] == product_id), None)
```

**app.py:**
```python
from products import get_all_products, find_product

all_products = get_all_products()
print(all_products)

product = find_product(1)
print(product)
```

---

## Predict Before You Run

```python
import math

numbers = [16, 25, 9, 4]
roots = [math.sqrt(n) for n in numbers]
print(roots)
```

What does this print?

<details>
<summary>Show answer</summary>

`[4.0, 5.0, 3.0, 2.0]`

This uses a **list comprehension** — a compact way to build a list by looping.  
`[math.sqrt(n) for n in numbers]` means "for each n in numbers, compute sqrt(n) and put it in the list".

You will use this pattern frequently in the API.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `import Math` (capital M) | `ModuleNotFoundError` | Python modules are lowercase: `import math` |
| Installing packages without activating virtual env | Packages installed globally | Always activate venv first |
| Circular imports (A imports B, B imports A) | `ImportError` | Restructure so one imports the other, not both |
| Forgetting `requirements.txt` | Others cannot install the right packages | Run `pip freeze > requirements.txt` before pushing to GitHub |

---

## When Things Go Wrong

**`ModuleNotFoundError: No module named 'flask'`**  
Flask is not installed, or your virtual environment is not activated. Run `pip install flask` inside the venv.

**`ImportError: cannot import name 'X' from 'Y'`**  
The name you are importing does not exist in that module. Check the spelling and the module's documentation.

---

## Checkpoint

- [ ] You used `math` and `datetime` from the standard library
- [ ] You installed a package with `pip`
- [ ] You created and activated a virtual environment
- [ ] You split code across two files and imported from one into the other
- [ ] You understand what `requirements.txt` is for

---

**Next lesson:** [09 — Working with Files](./09-working-with-files)
