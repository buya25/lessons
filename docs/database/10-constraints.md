---
sidebar_position: 11
---

# 10 — Constraints

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** use constraints to enforce rules on your data so the database protects itself from bad input.

---

## The Hook

In lesson 05 you noticed that nothing stopped two users from having the same email address. That is a serious problem — your app cannot tell them apart.

Constraints are rules you set at the database level. They run before any data is saved.  
No matter what your app does — bug, hack, or careless developer — the database enforces the rules.

---

## The Constraints You Need to Know

| Constraint | What it enforces |
|-----------|-----------------|
| `NOT NULL` | Column must always have a value |
| `UNIQUE` | No two rows can have the same value in this column |
| `PRIMARY KEY` | Unique + NOT NULL — the row's identity |
| `DEFAULT` | A fallback value if none is provided |
| `CHECK` | A custom rule the value must satisfy |
| `FOREIGN KEY` | Value must exist in another table (covered in lesson 12) |

---

## NOT NULL

You have been using this already. It means the column cannot be empty:

```sql
name VARCHAR(100) NOT NULL
```

If you try to insert a row without a value for `name`, the database rejects it.

---

## UNIQUE

No two rows can share the same value:

```sql
email VARCHAR(150) NOT NULL UNIQUE
```

Try this now — add a UNIQUE constraint to the email column:

```sql
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

Now try inserting a duplicate email:

```sql
INSERT INTO users (name, email, age) VALUES ('Test', 'alice.new@email.com', 20);
```

You will get: `ERROR 1062: Duplicate entry 'alice.new@email.com' for key 'unique_email'`  
The database stopped bad data before it ever got in.

---

## PRIMARY KEY

A primary key is `NOT NULL + UNIQUE` — it is the definitive identifier for a row.

```sql
PRIMARY KEY (id)
```

Every table should have one. You set it in lesson 03.

---

## DEFAULT

A default value is used when no value is provided:

```sql
stock INT DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

With a default, you can omit the column in your `INSERT` and the database fills it in.

---

## CHECK

A custom rule the value must satisfy:

```sql
age INT CHECK (age >= 0 AND age <= 120),
price DECIMAL(10,2) CHECK (price >= 0)
```

Try inserting a negative price:

```sql
INSERT INTO products (name, price, stock) VALUES ('Bad Product', -50.00, 10);
```

You will get: `ERROR 3819: Check constraint 'products_chk_1' is violated`

---

## Rebuild the Tables Properly

Now that you know all the constraints, let us recreate the tables with proper rules.  
Drop the old ones first:

```sql
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
```

Recreate `users`:

```sql
CREATE TABLE users (
  id         INT            NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)   NOT NULL,
  email      VARCHAR(150)   NOT NULL,
  age        INT            CHECK (age >= 0 AND age <= 120),
  is_active  BOOLEAN        DEFAULT TRUE,
  created_at DATETIME       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (email)
);
```

Recreate `products`:

```sql
CREATE TABLE products (
  id          INT            NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)   NOT NULL,
  price       DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
  stock       INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

Re-insert your test data:

```sql
INSERT INTO users (name, email, age) VALUES
  ('Alice Mwangi',  'alice@email.com',  24),
  ('Brian Oduya',   'brian@email.com',  31),
  ('Clara Ndungu',  'clara@email.com',  19);

INSERT INTO products (name, price, stock) VALUES
  ('Notebook', 150.00, 200),
  ('Pen',      20.00,  500),
  ('Backpack', 850.00, 45);
```

---

## What Happens If...

Try each of these and read the error carefully:

```sql
-- 1. Duplicate email
INSERT INTO users (name, email) VALUES ('Copy', 'alice@email.com');

-- 2. Negative price
INSERT INTO products (name, price, stock) VALUES ('Bad', -10.00, 5);

-- 3. NULL name
INSERT INTO users (email, age) VALUES ('noname@email.com', 22);
```

<details>
<summary>What errors do you see?</summary>

1. `Duplicate entry` — UNIQUE constraint violated
2. `Check constraint violated` — CHECK on price failed
3. `Field 'name' doesn't have a default value` — NOT NULL violated

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| No UNIQUE on email | Duplicate accounts | Add `UNIQUE (email)` |
| No CHECK on price/age | Negative values saved silently | Add `CHECK (price >= 0)` etc. |
| PRIMARY KEY on a column that is not auto-incrementing | Must manually manage IDs | Use `AUTO_INCREMENT` |
| Too many UNIQUE constraints | Slower inserts on large tables | Only add UNIQUE where it is a real business rule |

---

## When Things Go Wrong

**"Duplicate entry for key"**  
UNIQUE constraint triggered — you are trying to insert a value that already exists.

**"Check constraint violated"**  
A CHECK rule failed — your value does not meet the requirement.

**"Cannot add foreign key constraint"**  
Covered in lesson 12. For now, make sure all referenced tables and columns exist first.

---

## Checkpoint

- [ ] You added a UNIQUE constraint to the `email` column
- [ ] You confirmed a duplicate email is rejected
- [ ] You rebuilt `users` and `products` with all proper constraints
- [ ] You understand what each of the five constraints does

---

**Next lesson:** [11 — Aggregate Functions](./11-aggregate-functions)
