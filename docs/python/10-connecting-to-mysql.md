---
sidebar_position: 11
---

# 10 — Connecting to MySQL

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** connect Python to your MySQL database, run queries, and get results back as Python dictionaries.

---

## The Hook

Your SQL knowledge and your Python knowledge are about to meet.

You spent 15 lessons building a database. Now Python will talk to it — reading products, creating orders, registering users — all through Python code instead of the MySQL command line.

---

## Install the Connector

```bash
pip install mysql-connector-python
```

---

## Connect to the Database

```python
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

connection = mysql.connector.connect(
    host     = os.getenv("DB_HOST"),
    user     = os.getenv("DB_USER"),
    password = os.getenv("DB_PASSWORD"),
    database = os.getenv("DB_NAME"),
)

print("Connected:", connection.is_connected())
connection.close()
```

Your `.env` file should have:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce
```

---

## Running a SELECT Query

```python
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

conn = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
)

cursor = conn.cursor(dictionary=True)  # returns rows as dicts
cursor.execute("SELECT id, name, price FROM products")

products = cursor.fetchall()  # get all results

for product in products:
    print(f"{product['name']:15} KES {product['price']:.2f}")

cursor.close()
conn.close()
```

`dictionary=True` makes each row a `dict` like `{"id": 1, "name": "Notebook", "price": 150}` — much easier to work with than tuples.

---

## A Database Helper — Reusable Connection

Writing the connection code every time is tedious. Put it in a helper file:

**db.py:**

```python
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def get_connection():
    return mysql.connector.connect(
        host     = os.getenv("DB_HOST"),
        user     = os.getenv("DB_USER"),
        password = os.getenv("DB_PASSWORD"),
        database = os.getenv("DB_NAME"),
    )
```

Now use it anywhere:

```python
from db import get_connection

conn   = get_connection()
cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT * FROM products")
print(cursor.fetchall())
cursor.close()
conn.close()
```

---

## INSERT, UPDATE, DELETE — Writing Data

Queries that modify data need `conn.commit()` to save the changes:

```python
from db import get_connection

conn   = get_connection()
cursor = conn.cursor()

cursor.execute(
    "INSERT INTO products (name, price, stock) VALUES (%s, %s, %s)",
    ("Ruler", 15.00, 300)
)

conn.commit()
print(f"Inserted product with id: {cursor.lastrowid}")

cursor.close()
conn.close()
```

Notice `%s` placeholders — **never** build SQL with f-strings or string concatenation. That is SQL injection — a serious security vulnerability. Always use placeholders.

---

## Parameterised Queries — Security Rule

**Never do this:**

```python
name = input("Enter product name: ")
cursor.execute(f"SELECT * FROM products WHERE name = '{name}'")
```

A user could input `'; DROP TABLE products; --` and destroy your database. This is called **SQL injection**.

**Always do this:**

```python
name = input("Enter product name: ")
cursor.execute("SELECT * FROM products WHERE name = %s", (name,))
```

The `%s` placeholder and tuple syntax handles escaping automatically. No exceptions.

---

## Fetch Options

```python
cursor.execute("SELECT * FROM products")

one   = cursor.fetchone()   # first row only
all   = cursor.fetchall()   # all remaining rows
some  = cursor.fetchmany(5) # next 5 rows
```

---

## Predict Before You Run

Given a `products` table with 3 rows, what does this code print?

```python
cursor.execute("SELECT COUNT(*) AS total FROM products")
result = cursor.fetchone()
print(result["total"])
```

<details>
<summary>Answer</summary>

`3` — `COUNT(*)` returns one row with the count, `fetchone()` gets that row, `["total"]` gets the value.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Forgetting `conn.commit()` | Changes not saved | Always commit after INSERT/UPDATE/DELETE |
| Using f-strings in SQL | SQL injection vulnerability | Use `%s` placeholders always |
| Not closing cursor and connection | Memory leak / connection pool exhaustion | Always call `.close()` or use `with` |
| `cursor.fetchall()` on an INSERT | Error | `fetchall()` only works after SELECT |

---

## When Things Go Wrong

**`mysql.connector.errors.DatabaseError: 2003: Can't connect to MySQL server`**  
MySQL is not running, or the host/port is wrong. Start your MySQL server.

**`mysql.connector.errors.ProgrammingError: 1146: Table doesn't exist`**  
You are connected to the wrong database, or the table was not created. Check `USE ecommerce;` and run `SHOW TABLES;` in MySQL to verify.

**`InterfaceError: No result set to fetch from`**  
You called `fetchall()` after an INSERT/UPDATE/DELETE. Only call fetch after SELECT.

---

## Checkpoint

- [ ] You connected Python to MySQL using `.env` credentials
- [ ] You retrieved products as a list of dictionaries
- [ ] You inserted a row using `%s` parameterised queries
- [ ] You understand why f-strings in SQL are a security risk
- [ ] You created `db.py` as a reusable connection helper

---

**Next lesson:** [11 — Building a REST API with Flask](./11-building-a-rest-api)
