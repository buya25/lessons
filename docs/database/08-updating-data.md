---
sidebar_position: 9
---

# 08 — Updating Data

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** change existing data in a table safely, and understand why `UPDATE` without `WHERE` is one of the most dangerous commands in SQL.

---

## The Hook

Users change their email addresses. Product prices go up and down. Stock levels change with every sale.

Data is not static — it changes constantly. `UPDATE` is how you change it.  
But `UPDATE` is also how you accidentally destroy it if you are not careful.

---

## Basic Syntax

```sql
UPDATE table_name
SET column = new_value
WHERE condition;
```

:::danger
**Always write the WHERE clause first, before SET.**  
The habit of writing WHERE before SET has saved many databases from accidental mass updates.
:::

---

## Update One Column

Change Alice's email address:

```sql
UPDATE users
SET email = 'alice.new@email.com'
WHERE id = 1;
```

Always use `id` in the `WHERE` clause when updating a specific row. IDs are unique — names and emails may not be.

---

## Update Multiple Columns at Once

```sql
UPDATE users
SET email = 'alice.updated@email.com',
    age   = 25
WHERE id = 1;
```

Separate multiple column updates with a comma inside `SET`.

---

## Update Multiple Rows

Reduce all product prices by 10%:

```sql
UPDATE products
SET price = price * 0.9;
```

Wait — there is no `WHERE` clause here.  
That is intentional: we want to update ALL products.  
But read the next section before you get comfortable with that.

---

## The Most Dangerous Mistake in SQL

Run this. Then immediately run `SELECT * FROM users` and see what happened.

```sql
UPDATE users SET age = 99;
```

Every single user now has `age = 99`.

There is no undo. No confirmation prompt. MySQL executes it instantly.

**This is why:**
1. You always write `WHERE` when updating a specific row
2. You test your `WHERE` clause with `SELECT` before running `UPDATE`

**The safe habit:**

```sql
-- Step 1: test your filter first
SELECT * FROM users WHERE id = 1;

-- Step 2: only once you confirm it returns the right row, run the UPDATE
UPDATE users SET age = 25 WHERE id = 1;
```

Now fix the damage from above:

```sql
UPDATE users SET age = 31 WHERE id = 2;  -- Brian
UPDATE users SET age = 19 WHERE id = 3;  -- Clara
UPDATE users SET age = 27 WHERE id = 4;  -- David
```

---

## Fill in the Blank

A product's stock just sold out. Write a query to set the stock of the product with `id = 3` to `0`.

```sql
UPDATE ___
SET ___ = ___
WHERE ___ = ___;
```

<details>
<summary>Show answer</summary>

```sql
UPDATE products
SET stock = 0
WHERE id = 3;
```

</details>

---

## What Happens If...

**What if the WHERE condition matches zero rows?**

```sql
UPDATE users SET age = 50 WHERE id = 999;
```

MySQL runs it successfully but updates 0 rows. No error. Always check `SELECT` first to confirm rows exist.

**What if you want to increase a value rather than set it?**

```sql
-- Increase stock by 50
UPDATE products SET stock = stock + 50 WHERE id = 1;

-- Decrease stock by 1 (simulate a sale)
UPDATE products SET stock = stock - 1 WHERE id = 2;
```

You can use the column's current value in the expression.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| `UPDATE` without `WHERE` | Updates every row in the table | Always write `WHERE` for specific updates |
| Using `name` instead of `id` in `WHERE` | May update the wrong row if names are duplicated | Use the unique `id` to identify the row |
| Forgetting a comma between SET assignments | Syntax error | `SET col1 = val1, col2 = val2` |
| Not testing with SELECT first | Cannot undo the damage | Always SELECT before UPDATE |

---

## When Things Go Wrong

**"0 rows affected"**  
Your `WHERE` clause matched nothing. Run a `SELECT` with the same `WHERE` to investigate.

**"You are using safe update mode"**  
MySQL Workbench has a safe mode that blocks `UPDATE` without a `WHERE` on a key column. This is a feature, not a bug. Add `WHERE id = ...` or disable safe mode with `SET SQL_SAFE_UPDATES = 0;` (only for testing).

---

## Checkpoint

- [ ] You updated one column for a specific user
- [ ] You updated multiple columns in a single statement
- [ ] You understand why `UPDATE` without `WHERE` is dangerous
- [ ] You used the test-with-SELECT-first habit
- [ ] You used a column's current value in an update (`stock = stock - 1`)

---

**Next lesson:** [09 — Deleting Data](./09-deleting-data)
