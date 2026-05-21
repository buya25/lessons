---
sidebar_position: 8
---

# 07 — Filtering and Sorting

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** combine multiple filter conditions, sort results, limit how many rows you get back, and search for partial text matches.

---

## The Hook

In the last lesson you filtered by one condition.  
But real queries are rarely that simple.

*"Show me all active users over 25 who signed up this month, sorted by name."*  
That is three conditions, plus sorting. This lesson covers exactly that.

---

## Combine Conditions with AND / OR

**AND** — both conditions must be true:

```sql
SELECT * FROM users WHERE age > 20 AND age < 30;
```

Returns users whose age is between 21 and 29.

**OR** — at least one condition must be true:

```sql
SELECT * FROM users WHERE age < 20 OR age > 30;
```

Returns users who are either under 20 or over 30.

**NOT** — reverses a condition:

```sql
SELECT * FROM users WHERE NOT age = 24;
```

Returns everyone except Alice.

---

## Combine AND and OR — Be Careful

```sql
SELECT * FROM users WHERE age > 25 OR name = 'Clara Ndungu' AND age < 20;
```

**Predict before you run:** how many rows does this return?

SQL evaluates `AND` before `OR` — just like multiplication before addition in maths.  
The query above is actually: `age > 25 OR (name = 'Clara Ndungu' AND age < 20)`

Use parentheses to make your intent explicit:

```sql
-- Get users over 25, OR Clara specifically:
SELECT * FROM users WHERE age > 25 OR (name = 'Clara Ndungu' AND age < 20);

-- Get users who are both over 25 AND named a specific thing:
SELECT * FROM users WHERE (age > 25) AND (name = 'David Kamau' OR name = 'Brian Oduya');
```

When in doubt, add parentheses. They cost nothing.

---

## Search Text with LIKE

Find rows where a column contains or starts with a pattern:

```sql
-- Names that start with 'A'
SELECT * FROM users WHERE name LIKE 'A%';

-- Emails from gmail
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Names with 'am' anywhere in them
SELECT * FROM users WHERE name LIKE '%am%';
```

`%` matches any number of characters (including zero).  
`_` matches exactly one character.

---

## Sort Results with ORDER BY

```sql
-- Alphabetical order
SELECT * FROM users ORDER BY name ASC;

-- Youngest to oldest
SELECT * FROM users ORDER BY age ASC;

-- Oldest to youngest
SELECT * FROM users ORDER BY age DESC;
```

`ASC` = ascending (A→Z, 0→9). This is the default.  
`DESC` = descending (Z→A, 9→0).

Sort by multiple columns:

```sql
SELECT * FROM users ORDER BY age DESC, name ASC;
```

First sort by age (oldest first), then within same age sort by name alphabetically.

---

## Limit Results with LIMIT

Only return the first N rows:

```sql
SELECT * FROM users ORDER BY age DESC LIMIT 2;
```

Returns the 2 oldest users.

Skip rows with OFFSET (useful for pagination):

```sql
-- Page 1: first 2 users
SELECT * FROM users ORDER BY id LIMIT 2 OFFSET 0;

-- Page 2: next 2 users
SELECT * FROM users ORDER BY id LIMIT 2 OFFSET 2;
```

---

## Fill in the Blank

Write a query that:
- Returns only `name` and `age`
- For users aged 20 to 30 (inclusive)
- Sorted by age from youngest to oldest
- Showing only the first 2 results

```sql
SELECT ___, ___ FROM users
WHERE age >= ___ AND age <= ___
ORDER BY age ___
LIMIT ___;
```

<details>
<summary>Show answer</summary>

```sql
SELECT name, age FROM users
WHERE age >= 20 AND age <= 30
ORDER BY age ASC
LIMIT 2;
```

</details>

---

## What Happens If...

- What if you use `LIMIT` without `ORDER BY`? MySQL returns rows in no guaranteed order — different runs may return different rows. Always pair `LIMIT` with `ORDER BY`.

- What if `LIKE '%a%'` — does it match uppercase `A`? In MySQL's default settings, yes — `LIKE` is case-insensitive. To force case-sensitivity, use `LIKE BINARY '%a%'`.

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `AND`/`OR` without parentheses in complex conditions | Wrong rows returned, no error | Add parentheses to group conditions explicitly |
| `LIKE 'name%'` instead of `LIKE '%name%'` | Misses matches in the middle | Use `%` on both sides for "contains" searches |
| `ORDER BY` without `LIMIT` in large tables | Returns millions of rows | Always add `LIMIT` when just exploring |
| Sorting by a column not in `SELECT` | Works fine — not a mistake | Just be aware it is allowed |

---

## When Things Go Wrong

**"Unknown column in WHERE clause"**  
You used an alias from `SELECT` in the `WHERE`. Aliases are not available in `WHERE` — only in `ORDER BY` and `HAVING` (covered later).

**Query is very slow**  
You are doing a `LIKE '%something%'` search. This cannot use indexes (covered in lesson 14) and scans every row. For full-text search at scale, use dedicated tools — but for now it is fine.

---

## Checkpoint

- [ ] You combined two conditions with `AND`
- [ ] You used `OR` correctly
- [ ] You searched text with `LIKE` and `%`
- [ ] You sorted results with `ORDER BY`
- [ ] You limited results with `LIMIT` and `OFFSET`
- [ ] You completed the fill-in-the-blank query

---

**Next lesson:** [08 — Updating Data](./08-updating-data)
