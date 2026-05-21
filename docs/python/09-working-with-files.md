---
sidebar_position: 10
---

# 09 — Working with Files

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** read from and write to files, work with CSV data, and load configuration from `.env` files.

---

## The Hook

Your API will read configuration from files (database credentials, secret keys).  
Your data processing scripts will read CSV files from clients.  
Your logging system will write errors to log files.

Files are everywhere — knowing how to work with them is essential.

---

## Reading a File

```python
with open("products.txt", "r") as file:
    content = file.read()
    print(content)
```

- `"r"` = read mode
- `with` automatically closes the file when done — always use it
- `.read()` returns the entire file as a string

Read line by line (better for large files):

```python
with open("products.txt", "r") as file:
    for line in file:
        print(line.strip())  # strip() removes the newline at end of each line
```

Read all lines into a list:

```python
with open("products.txt", "r") as file:
    lines = file.readlines()  # ['Notebook\n', 'Pen\n', 'Backpack\n']
```

---

## Writing a File

```python
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("Second line\n")
```

- `"w"` = write mode — creates the file if it does not exist, **overwrites** if it does
- `"a"` = append mode — adds to the end without overwriting

```python
with open("log.txt", "a") as file:
    file.write("User logged in at 2026-05-21\n")
```

---

## Try It — Create and Read a File

Create a file with product names:

```python
products = ["Notebook", "Pen", "Backpack", "Eraser"]

with open("products.txt", "w") as file:
    for product in products:
        file.write(product + "\n")

print("File written")

# Now read it back
with open("products.txt", "r") as file:
    for line in file:
        print(line.strip())
```

---

## CSV Files — Comma Separated Values

CSV is the most common format for sharing data between systems. Python has a built-in `csv` module:

```python
import csv

# Write CSV
products = [
    ["id", "name", "price"],
    [1, "Notebook", 150],
    [2, "Pen", 20],
    [3, "Backpack", 850],
]

with open("products.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(products)

# Read CSV
with open("products.csv", "r") as file:
    reader = csv.DictReader(file)  # reads each row as a dict
    for row in reader:
        print(f"{row['name']:15} KES {row['price']}")
```

---

## .env Files — Storing Secrets

Never hardcode passwords or API keys in your code. Use a `.env` file:

**Create `.env`:**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root1234
DB_NAME=ecommerce
```

**Add `.env` to `.gitignore`** so it never gets pushed to GitHub:

```
# .gitignore
.env
venv/
__pycache__/
```

**Read it in Python:**

```bash
pip install python-dotenv
```

```python
from dotenv import load_dotenv
import os

load_dotenv()  # loads .env into environment variables

host     = os.getenv("DB_HOST")
user     = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
db_name  = os.getenv("DB_NAME")

print(f"Connecting to {db_name} on {host}")
```

This pattern is how every real Python application handles configuration.

---

## Predict Before You Run

```python
with open("test.txt", "w") as f:
    f.write("Line 1\n")
    f.write("Line 2\n")

with open("test.txt", "r") as f:
    lines = f.readlines()

print(len(lines))
print(lines[0].strip())
print(lines[-1].strip())
```

What does this print?

<details>
<summary>Show answers</summary>

```
2
Line 1
Line 2
```

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Opening without `with` | File may not close properly | Always use `with open(...)` |
| `"w"` mode when you wanted append | File wiped | Use `"a"` to append |
| Committing `.env` to GitHub | Secrets exposed publicly | Add `.env` to `.gitignore` immediately |
| Reading a file that does not exist | `FileNotFoundError` | Wrap in try/except or check with `os.path.exists()` |
| Forgetting `newline=""` when writing CSV on Windows | Extra blank lines in file | Always add `newline=""` to `open()` when writing CSV |

---

## When Things Go Wrong

**`FileNotFoundError: [Errno 2] No such file or directory`**  
The file path is wrong or the file does not exist. Check the path relative to where your script runs, not relative to the file.

**CSV has extra blank lines between rows (Windows)**  
Add `newline=""` to the `open()` call when writing: `open("file.csv", "w", newline="")`.

---

## Checkpoint

- [ ] You created a text file and read it back
- [ ] You appended to a file without overwriting
- [ ] You wrote and read a CSV file
- [ ] You created a `.env` file and loaded it with `python-dotenv`
- [ ] You added `.env` to `.gitignore`

---

**Next lesson:** [10 — Connecting to MySQL](./10-connecting-to-mysql)
