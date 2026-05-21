---
sidebar_position: 7
---

# 06 — Reading Data

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** retrieve data from a table — all of it, specific columns, or filtered rows.

---

## The Hook

Data sitting in a database that you cannot read is useless.  
`SELECT` is the most important SQL command you will learn — you will use it in every single query for the rest of your career.

---

## Get Everything

```sql
SELECT * FROM users;
```

`*` means "all columns". This returns every row, every column.

It is useful for exploring data, but in real applications you almost never use `SELECT *` — you only ask for the columns you actually need.

---

## Get Specific Columns

```sql
SELECT name, email FROM users;
```

This returns only the `name` and `email` columns — the `id`, `age`, and `created_at` are not included.

Why does this matter?
- Faster — less data transferred
- Safer — you do not accidentally expose sensitive columns
- Cleaner — your app only gets what it needs

---

## Give Columns a Nickname (Alias)

You can rename a column in the output without changing the table:

```sql
SELECT name AS full_name, email AS contact FROM users;
```

The column headers in the result will show `full_name` and `contact` instead of `name` and `email`.

---

## Filter With WHERE

Get only rows that match a condition:

```sql
SELECT * FROM users WHERE age > 25;
```

```sql
SELECT name, email FROM users WHERE age = 24;
```

```sql
SELECT * FROM users WHERE name = 'Alice Mwangi';
```

Comparison operators:

| Operator | Meaning |
|----------|---------|
| `=` | Equal to |
| `!=` or `<>` | Not equal to |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater than or equal |
| `<=` | Less than or equal |

---

## Predict Before You Run

Without running anything, predict the output of each query.  
Then run them and check.

Your `users` table has: Alice (24), Brian (31), Clara (19), David (27).

1. `SELECT * FROM users WHERE age < 25;`
2. `SELECT name FROM users WHERE age >= 27;`
3. `SELECT * FROM users WHERE name = 'Brian Oduya';`

<details>
<summary>Show answers</summary>

1. Returns Alice (24) and Clara (19)
2. Returns Brian (31) and David (27)
3. Returns only Brian's full row

</details>

---

## Check for NULL

You cannot use `= NULL` to find rows with no value. You must use `IS NULL`:

```sql
SELECT * FROM users WHERE age IS NULL;
```

And to find rows that DO have a value:

```sql
SELECT * FROM users WHERE age IS NOT NULL;
```

---

## Fill in the Blank

Write a query that returns only the `name` and `email` of users who are 27 or older.

```sql
SELECT ___, ___ FROM users WHERE ___ >= ___;
```

<details>
<summary>Show answer</summary>

```sql
SELECT name, email FROM users WHERE age >= 27;
```

</details>

---

## Break It

What is wrong with this query?

```sql
SELECT name, email
FROM users
WHERE age = NULL;
```

<details>
<summary>Answer</summary>

`= NULL` never works in SQL. Use `IS NULL` instead:

```sql
SELECT name, email FROM users WHERE age IS NULL;
```

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `SELECT *` in production code | Slow, exposes all columns | List only the columns you need |
| `WHERE age = NULL` | Returns no rows, silently | Use `WHERE age IS NULL` |
| Using double quotes for strings: `WHERE name = "Alice"` | Works in some databases, not standard | Use single quotes: `WHERE name = 'Alice'` |
| Forgetting `FROM` | Syntax error | `SELECT ... FROM table_name` |

---

## When Things Go Wrong

**"Unknown column 'username' in field list"**  
The column name does not exist in the table. Run `DESCRIBE users;` to see the actual column names.

**"You have an error in your SQL syntax near WHERE"**  
Common cause: missing `FROM table_name` before the `WHERE` clause.

**Query returns 0 rows but you expect results**  
Check capitalisation — `WHERE name = 'alice'` will not match `'Alice Mwangi'`. SQL string comparisons are case-insensitive in MySQL by default, but it depends on your settings. Test with `LOWER(name) = 'alice'` if unsure.

---

## Checkpoint

- [ ] You can retrieve all columns with `SELECT *`
- [ ] You can retrieve specific columns by name
- [ ] You used `WHERE` to filter by a number and by text
- [ ] You understand why `IS NULL` is used instead of `= NULL`
- [ ] You completed the fill-in-the-blank query

---

**Next lesson:** [07 — Filtering and Sorting](./07-filtering-and-sorting)
