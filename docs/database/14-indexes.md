---
sidebar_position: 15
---

# 14 — Indexes

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain what an index is, create one, and know when to add or skip them.

---

## The Hook

Imagine a 500-page book with no table of contents and no index.  
To find the word "database", you read every page from the start. That is what MySQL does when a table has no index — it reads every row.

With 100 users, that is fine. With 10 million users, a single query can take 30 seconds.  
An index solves this.

---

## What an Index Is

An index is a separate, sorted data structure that MySQL maintains alongside your table.  
When you search by an indexed column, MySQL jumps directly to the result — like a book index pointing you to the exact page.

The trade-off:
- **Faster reads** — queries on indexed columns are dramatically faster
- **Slower writes** — every INSERT, UPDATE, DELETE must also update the index
- **More disk space** — the index takes up storage

---

## Indexes You Already Have

MySQL automatically creates an index on `PRIMARY KEY`.  
MySQL creates an index on every `UNIQUE` column.

So `users.id` and `users.email` are already indexed.

---

## Create an Index

Add an index on `users.name` for faster name searches:

```sql
CREATE INDEX idx_users_name ON users (name);
```

Naming convention: `idx_tablename_columnname` — descriptive and consistent.

See all indexes on a table:

```sql
SHOW INDEX FROM users;
```

---

## When to Add an Index

Add an index when:
- You frequently search, filter, or sort by a column (`WHERE`, `ORDER BY`, `JOIN ON`)
- The column has many distinct values (high cardinality)

Do NOT add an index when:
- The table is small (under a few thousand rows) — full scan is faster
- The column has very few distinct values (e.g. `is_active` — only `TRUE` or `FALSE`)
- The table has very frequent writes — the index maintenance cost outweighs the read benefit

---

## EXPLAIN — See What MySQL Is Doing

`EXPLAIN` shows you how MySQL plans to execute a query:

```sql
EXPLAIN SELECT * FROM users WHERE name = 'Alice Mwangi';
```

Look at the `type` column in the output:

| type | Meaning |
|------|---------|
| `const` | Fastest — lookup by primary key |
| `ref` | Good — using an index |
| `ALL` | Full table scan — slow on large tables |

If you see `ALL` on a large table and that column is used frequently, add an index.

---

## Composite Indexes

An index on multiple columns — useful when you often filter by two columns together:

```sql
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
```

This speeds up queries like:

```sql
SELECT * FROM orders WHERE user_id = 1 AND status = 'pending';
```

Order matters: this index helps `WHERE user_id = 1` and `WHERE user_id = 1 AND status = 'pending'`, but NOT `WHERE status = 'pending'` alone.

---

## Drop an Index

```sql
DROP INDEX idx_users_name ON users;
```

---

## What Happens If...

Run both of these and compare using `EXPLAIN`:

```sql
-- Without index on age
EXPLAIN SELECT * FROM users WHERE age = 24;

-- Add an index
CREATE INDEX idx_users_age ON users (age);

-- With index
EXPLAIN SELECT * FROM users WHERE age = 24;
```

On a small table the difference is invisible — indexes only matter at scale. But `EXPLAIN` shows you the plan difference.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Adding an index on every column | Slower writes, wasted space | Only index columns you actually query by |
| Forgetting to index foreign key columns | Slow JOINs | Always index foreign key columns |
| Expecting indexes to fix a bad query | Index only helps if the query can use it | Fix the query logic first, then add indexes |
| `LIKE '%text%'` — assumes index helps | Index is not used for leading wildcard | For full-text search, use `FULLTEXT INDEX` or a dedicated search tool |

---

## When Things Go Wrong

**Query is still slow after adding an index**  
Run `EXPLAIN` — if `type` is still `ALL`, MySQL chose not to use the index. Possible reasons: too few distinct values, statistics are stale (run `ANALYZE TABLE users;`), or the query is written in a way that prevents index use (e.g. `WHERE YEAR(created_at) = 2026` — wrap the column in a function and the index is skipped).

---

## Checkpoint

- [ ] You created an index on `users.name`
- [ ] You ran `SHOW INDEX FROM users`
- [ ] You used `EXPLAIN` to see the query execution plan
- [ ] You can explain the trade-off: faster reads vs slower writes
- [ ] You know when NOT to add an index

---

**Next lesson:** [15 — Transactions](./15-transactions)
