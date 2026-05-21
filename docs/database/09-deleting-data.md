---
sidebar_position: 10
---

# 09 — Deleting Data

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** delete specific rows, all rows, or an entire table — and know which command to use and when.

---

## The Hook

Deleting data sounds simple. And it is — until you delete the wrong rows.

`DELETE` without `WHERE` is the SQL equivalent of deleting your entire hard drive.  
It works instantly, silently, and there is no recycle bin.

---

## Delete Specific Rows

```sql
DELETE FROM users WHERE id = 4;
```

This deletes only David (id = 4). The same safe habit from `UPDATE` applies here:

```sql
-- Step 1: confirm what you are about to delete
SELECT * FROM users WHERE id = 4;

-- Step 2: then delete
DELETE FROM users WHERE id = 4;
```

---

## Delete Multiple Rows with a Condition

Delete all users under 20:

```sql
DELETE FROM users WHERE age < 20;
```

This deletes Clara (age 19). Verify with `SELECT * FROM users` after.

---

## The Most Dangerous Command

```sql
DELETE FROM users;
```

No `WHERE` clause. Every row is gone. The table still exists but it is now completely empty.

---

## Three Ways to Empty or Remove a Table

| Command | What it does | Can undo? | Table still exists? |
|---------|-------------|-----------|-------------------|
| `DELETE FROM users;` | Removes all rows, one by one | No | Yes |
| `TRUNCATE TABLE users;` | Clears all rows instantly, resets AUTO_INCREMENT | No | Yes |
| `DROP TABLE users;` | Deletes the table and all its data permanently | No | No |

**When to use each:**
- `DELETE WHERE ...` — removing specific rows in your app
- `TRUNCATE` — clearing test data to start fresh (development only)
- `DROP TABLE` — removing a table you no longer need

:::danger
Never run `TRUNCATE` or `DROP TABLE` on a production database without a backup.
:::

---

## Soft Delete — The Real World Approach

In production applications, data is rarely truly deleted.

Why? Audit trails, legal requirements, accidental deletion recovery.

Instead of `DELETE`, most apps use a **soft delete** — a column that marks the row as deleted without removing it:

```sql
-- Add a deleted_at column to users
ALTER TABLE users ADD COLUMN deleted_at DATETIME DEFAULT NULL;

-- "Delete" a user
UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = 1;

-- Show only active users (not deleted)
SELECT * FROM users WHERE deleted_at IS NULL;
```

The row stays in the database. The app just never shows it. This is what almost every real platform uses — from Twitter to Gmail's archive.

---

## Fill in the Blank

Write a query to delete all products where the stock is 0.

```sql
___ FROM products WHERE ___ = ___;
```

<details>
<summary>Show answer</summary>

```sql
DELETE FROM products WHERE stock = 0;
```

</details>

---

## What Happens If...

**What if DELETE affects rows you did not intend?**  
You cannot undo it. This is why `SELECT` before `DELETE` is non-negotiable.

**What if you try to delete a row that other tables reference?**  
You will see: `ERROR 1451: Cannot delete or update a parent row: a foreign key constraint fails`  
This means another table has a row that depends on this one. We cover this in the relationships lesson.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| `DELETE FROM table;` without WHERE | Deletes every row | Always test with SELECT first |
| `DROP TABLE` when you meant `DELETE FROM` | Table is gone completely | Know the difference — DROP removes the structure too |
| Deleting by name instead of id | Removes all rows with that name | Use `WHERE id = ...` for exact targeting |
| Skipping soft deletes in real apps | Permanent data loss | Add `deleted_at` and filter on it |

---

## When Things Go Wrong

**"Cannot delete or update a parent row: foreign key constraint fails"**  
Another table has rows that point to this one. You must either delete those rows first, or delete them automatically with `ON DELETE CASCADE` (covered in lesson 12).

**"0 rows affected"**  
Your `WHERE` clause matched nothing. Run `SELECT` with the same condition to investigate.

---

## Checkpoint

- [ ] You deleted a specific row using `WHERE id = ...`
- [ ] You understand the difference between `DELETE`, `TRUNCATE`, and `DROP TABLE`
- [ ] You understand what a soft delete is and why real apps use it
- [ ] You tested with `SELECT` before running `DELETE`

---

**Next lesson:** [10 — Constraints](./10-constraints)
