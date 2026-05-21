---
sidebar_position: 5
---

# 04 — Data Types

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** choose the right data type for any column and explain why the choice matters.

---

## The Hook

What happens if you store a price as `"850 shillings"` instead of `850`?

You cannot add it. You cannot compare it. You cannot sort products by price.  
The database will treat it as text — useless for any calculation.

Choosing the wrong data type is one of the most common beginner mistakes, and it is almost impossible to fix cheaply once a table has real data in it. Get it right from the start.

---

## The Main Data Types

### Numbers

| Type | Use it for | Example |
|------|-----------|---------|
| `INT` | Whole numbers | age, stock count, quantity |
| `BIGINT` | Very large whole numbers | user IDs in a huge app |
| `DECIMAL(total, decimals)` | Money, precise decimals | `DECIMAL(10,2)` → `9999999.99` |
| `FLOAT` | Approximate decimals (science/stats) | temperatures, coordinates |

:::warning
Never use `FLOAT` for money. It has rounding errors. `DECIMAL(10,2)` is always correct for currency.
:::

---

### Text

| Type | Use it for | Max size |
|------|-----------|---------|
| `VARCHAR(n)` | Short text with a known max length | up to 65,535 chars |
| `TEXT` | Long text with no predictable length | ~65,000 chars |
| `LONGTEXT` | Very long content (blog posts, articles) | ~4GB |
| `CHAR(n)` | Fixed-length text (always exactly n chars) | country codes, codes |

**Rule of thumb:**
- Name, email, title → `VARCHAR`
- Description, bio, comment → `TEXT`
- Country code (`KE`, `US`) → `CHAR(2)`

---

### Dates and Times

| Type | Stores | Example |
|------|--------|---------|
| `DATE` | Date only | `2026-05-21` |
| `TIME` | Time only | `14:30:00` |
| `DATETIME` | Date + time | `2026-05-21 14:30:00` |
| `TIMESTAMP` | Date + time, auto-updates | same format, timezone-aware |

**Rule of thumb:**
- When was this record created? → `DATETIME DEFAULT CURRENT_TIMESTAMP`
- When was a booking? → `DATETIME`
- Just a birthday? → `DATE`

---

### True / False

| Type | Use it for |
|------|-----------|
| `BOOLEAN` | Yes/no values — stored as `1` (true) or `0` (false) |
| `TINYINT(1)` | Same thing — MySQL converts `BOOLEAN` to this internally |

Example: `is_active BOOLEAN DEFAULT TRUE`

---

## Predict Before You Run

What data type would you use for each of these? Write your answers before reading on.

1. A product's price (e.g. 1,499.99)
2. A user's bio (could be a few sentences or several paragraphs)
3. The date someone was born
4. Whether a user's account is active or suspended
5. A country code like `KE` or `US`
6. The number of items in a shopping cart

<details>
<summary>Show answers</summary>

1. `DECIMAL(10,2)`
2. `TEXT`
3. `DATE`
4. `BOOLEAN`
5. `CHAR(2)`
6. `INT`

</details>

---

## NULL — The Special Case

`NULL` means **no value** — not zero, not empty string, nothing.

```sql
age INT          -- age can be NULL (unknown)
age INT NOT NULL -- age must always have a value
```

`NULL` causes confusion because:
- `NULL = NULL` is FALSE in SQL
- `NULL + 5` is NULL
- You must use `IS NULL` not `= NULL` to check for it

You will meet `NULL` again when we cover filtering. For now: **add `NOT NULL` to every column where a missing value would cause problems**.

---

## Break It

Run this and observe what happens:

```sql
CREATE TABLE test_types (
  price FLOAT,
  alt_price DECIMAL(10,2)
);

INSERT INTO test_types VALUES (0.1 + 0.2, 0.1 + 0.2);
SELECT * FROM test_types;
```

**What do you see in the `price` column?**  
You will see something like `0.30000000000000004` — a floating point rounding error.  
The `DECIMAL` column shows `0.30` — exactly correct.

Drop the test table when done:

```sql
DROP TABLE test_types;
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Using `FLOAT` for money | Rounding errors in totals | Always use `DECIMAL(10,2)` |
| Using `TEXT` for everything | Slower queries, cannot index properly | Use `VARCHAR` when you know the max length |
| Storing dates as `VARCHAR` (`"21-05-2026"`) | Cannot sort, filter, or calculate date differences | Always use `DATE` or `DATETIME` |
| Not using `NOT NULL` where required | Silent empty records that break your app | Add `NOT NULL` to every required field |
| Using `INT` for very large IDs (millions of users) | Runs out at ~2.1 billion | Use `BIGINT` for IDs in large systems |

---

## When Things Go Wrong

**"Out of range value for column"**  
You are trying to store a number bigger than the type allows. Check your `INT` vs `BIGINT`, or your `DECIMAL` size.

**"Incorrect datetime value"**  
Your date format is wrong. MySQL expects `YYYY-MM-DD` for dates. `21/05/2026` will fail — use `2026-05-21`.

**"Data too long for column"**  
You exceeded the `VARCHAR(n)` limit. Either increase n or switch to `TEXT`.

---

## Checkpoint

- [ ] You can name the four main categories of data types (numbers, text, dates, boolean)
- [ ] You know never to use `FLOAT` for money
- [ ] You understand what `NULL` means and when to use `NOT NULL`
- [ ] You chose the right types for all six examples above

---

**Next lesson:** [05 — Inserting Data](./05-inserting-data)
