---
sidebar_position: 6
---

# 05 — Inserting Data

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** add single rows, multiple rows, and specific columns of data into a table.

---

## The Hook

You have tables. They are empty.  
Data does not appear by magic — you have to put it there.

Every user who signs up, every product added to a store, every order placed — all of it starts with an `INSERT` statement.

---

## Basic Syntax

```sql
INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3);
```

The column names and values must match in order and count.

---

## Insert One Row

Add a user to the `users` table:

```sql
INSERT INTO users (name, email, age)
VALUES ('Alice Mwangi', 'alice@email.com', 24);
```

Notice:
- We did not include `id` — MySQL fills it in automatically (`AUTO_INCREMENT`)
- We did not include `created_at` — it uses the default (`CURRENT_TIMESTAMP`)
- Text values are wrapped in single quotes `'...'`
- Numbers are not quoted

---

## Insert Multiple Rows

You can insert many rows in one statement — much faster than one at a time:

```sql
INSERT INTO users (name, email, age)
VALUES
  ('Brian Oduya',   'brian@email.com',  31),
  ('Clara Ndungu',  'clara@email.com',  19),
  ('David Kamau',   'david@email.com',  27);
```

Three rows inserted in one command.

---

## Verify What Was Inserted

```sql
SELECT * FROM users;
```

You should see all four users with their auto-generated `id` values.

---

## Fill in the Blank

Insert three products into the `products` table.  
The products are:
- Notebook, price 150.00, stock 200
- Pen, price 20.00, stock 500
- Backpack, price 850.00, stock 45

Write the INSERT statement yourself before looking at the answer.

<details>
<summary>Show answer</summary>

```sql
INSERT INTO products (name, price, stock)
VALUES
  ('Notebook', 150.00, 200),
  ('Pen',      20.00,  500),
  ('Backpack', 850.00, 45);
```

</details>

---

## What Happens If...

**What if you try to insert a duplicate email?**

Right now, nothing stops it. Two users could have the same email address.  
Run this twice:

```sql
INSERT INTO users (name, email, age)
VALUES ('Duplicate', 'alice@email.com', 30);
```

Two rows with the same email get inserted. That is a problem — later we will add a `UNIQUE` constraint to prevent this. For now, just notice the issue exists.

**What if you forget a required column?**

Try:

```sql
INSERT INTO users (name, age)
VALUES ('No Email', 25);
```

You will get: `ERROR: Field 'email' doesn't have a default value`  
The `NOT NULL` constraint is protecting you.

---

## Break It — Spot the Bugs

Each of these has an error. Find and fix it before running:

**Bug 1:**
```sql
INSERT INTO users (name, email, age)
VALUES (Alice Mwangi, 'alice2@email.com', 22);
```

**Bug 2:**
```sql
INSERT INTO users (name, email)
VALUES ('Bob', 'bob@email.com', 40);
```

**Bug 3:**
```sql
INSERT INTO products (name, price, stock)
VALUES ('Ruler', 'thirty', 100);
```

<details>
<summary>Show answers</summary>

**Bug 1:** `Alice Mwangi` is missing quotes — text must be in single quotes: `'Alice Mwangi'`

**Bug 2:** Three values given but only two column names listed — either add `age` to the column list or remove `40` from the values

**Bug 3:** `'thirty'` is a string — price is `DECIMAL`, must be a number: `30.00`

</details>

---

## Common Mistakes

| Mistake | Error You Will See | Fix |
|---------|--------------------|-----|
| Forgetting quotes around text | `Unknown column 'Alice'` | Wrap text in single quotes |
| Mismatched column/value count | `Column count doesn't match value count` | Count your columns and values — they must be equal |
| Using double quotes for text | May work but is non-standard | Use single quotes for string values |
| Inserting a string into a number column | `Incorrect integer value` | Use the right type for the column |
| Assuming `id` fills itself without `AUTO_INCREMENT` | Inserts `0` or errors | Always define `id` as `AUTO_INCREMENT` |

---

## When Things Go Wrong

**"Field doesn't have a default value"**  
A `NOT NULL` column has no default and you did not provide a value. Add it to your `INSERT`.

**"Data truncated for column"**  
Your value is too long for the column's type. Check your `VARCHAR` limit or `DECIMAL` size.

**"Incorrect integer value: '' for column"**  
You passed an empty string `''` into a number column. Use `NULL` or an actual number.

---

## Checkpoint

- [ ] You inserted a single row into `users`
- [ ] You inserted multiple rows in one statement
- [ ] You inserted three products into `products`
- [ ] You found and fixed all three bugs
- [ ] You understand why `NOT NULL` prevented the missing-email insert

---

**Next lesson:** [06 — Reading Data](./06-reading-data)
