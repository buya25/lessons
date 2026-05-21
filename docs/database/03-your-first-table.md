---
sidebar_position: 4
---

# 03 — Creating Your First Table

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** create a database, create a table inside it, and describe its structure.

---

## The Hook

Right now your MySQL server is running but it is empty.  
Let us build something inside it.

By the end of this lesson you will have created a real `users` table — the same one that almost every application on the internet has.

---

## Step 1 — Create a Database

A MySQL server can hold many databases. We need to create one for our project.

Open your MySQL session and run:

```sql
CREATE DATABASE lessons;
```

Now tell MySQL to use it for all future commands:

```sql
USE lessons;
```

You should see: `Database changed`

:::tip
You will type `USE lessons;` every time you start a new MySQL session. It tells MySQL which database your commands apply to.
:::

---

## Step 2 — Create a Table

Here is the syntax for creating a table:

```sql
CREATE TABLE table_name (
  column_name data_type constraints,
  column_name data_type constraints
);
```

Now let us create a real `users` table:

```sql
CREATE TABLE users (
  id        INT           NOT NULL AUTO_INCREMENT,
  name      VARCHAR(100)  NOT NULL,
  email     VARCHAR(150)  NOT NULL,
  age       INT,
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

Run it. If you see `Query OK`, the table exists.

---

## Breaking Down That Command

| Part | What it means |
|------|--------------|
| `id INT NOT NULL AUTO_INCREMENT` | A number that MySQL fills in automatically, starting at 1 |
| `name VARCHAR(100) NOT NULL` | Text up to 100 characters, cannot be empty |
| `email VARCHAR(150) NOT NULL` | Text up to 150 characters, cannot be empty |
| `age INT` | A whole number — optional (no NOT NULL) |
| `created_at DATETIME DEFAULT CURRENT_TIMESTAMP` | Date and time, automatically set when a row is added |
| `PRIMARY KEY (id)` | The `id` column uniquely identifies every row |

---

## Step 3 — Confirm It Exists

See all tables in your database:

```sql
SHOW TABLES;
```

See the structure of your table:

```sql
DESCRIBE users;
```

You should see each column with its type and settings listed out.

---

## Fill in the Blank

Create a `products` table yourself. It should have:
- An auto-incrementing `id`
- A `name` (cannot be empty, up to 100 characters)
- A `price` — use `DECIMAL(10, 2)` for money (10 digits total, 2 after the decimal point)
- A `stock` number (whole number, default value of `0`)
- A `created_at` timestamp

Write the full `CREATE TABLE` statement before looking at the answer below.

<details>
<summary>Show answer</summary>

```sql
CREATE TABLE products (
  id         INT            NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)   NOT NULL,
  price      DECIMAL(10,2)  NOT NULL,
  stock      INT            DEFAULT 0,
  created_at DATETIME       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

</details>

---

## Break It — What Does This Error Mean?

Run this and read the error carefully:

```sql
CREATE TABLE users (
  id INT
);
```

**What error do you get? Why?**  
The table `users` already exists. MySQL will not create a duplicate.

To avoid this error in future scripts, use:

```sql
CREATE TABLE IF NOT EXISTS users ( ... );
```

To delete a table and start over:

```sql
DROP TABLE users;
```

:::danger
`DROP TABLE` deletes the table and ALL its data permanently. There is no undo.
:::

---

## Common Mistakes

| Mistake | Why It Happens | Fix |
|---------|---------------|-----|
| Forgetting `USE database_name;` | Easy to skip | Always run `USE lessons;` first |
| Using spaces in column names: `first name` | Looks natural in English | Use underscores: `first_name` |
| Using `VARCHAR` without a length: `VARCHAR` | Feels unnecessary | Always specify: `VARCHAR(100)` |
| Forgetting `PRIMARY KEY` | Not obvious why it matters yet | Every table needs one — always add it |

---

## When Things Go Wrong

**"No database selected"**  
You forgot `USE lessons;` — run it and try again.

**"Table already exists"**  
Either drop the old table first (`DROP TABLE users;`) or use `CREATE TABLE IF NOT EXISTS`.

**"You have an error in your SQL syntax"**  
Read the error — MySQL tells you the line number. Common causes: missing comma between columns, missing closing parenthesis `)`.

---

## Checkpoint

- [ ] You created a database called `lessons`
- [ ] You created the `users` table
- [ ] `DESCRIBE users;` shows all columns correctly
- [ ] You created the `products` table yourself
- [ ] You understand what `PRIMARY KEY` and `AUTO_INCREMENT` do

---

**Next lesson:** [04 — Data Types](./04-data-types)
