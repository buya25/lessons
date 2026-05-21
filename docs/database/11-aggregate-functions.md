---
sidebar_position: 12
---

# 11 — Aggregate Functions

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** count rows, sum values, calculate averages, and group results to generate summary reports from your data.

---

## The Hook

*"How many users do we have?"*  
*"What is our total revenue this month?"*  
*"What is the average product price?"*  
*"Which category has the most products?"*

These are not questions about individual rows — they are questions about the whole dataset.  
Aggregate functions answer them.

---

## The Five Core Functions

| Function | What it does | Example |
|----------|-------------|---------|
| `COUNT()` | Count rows | How many users? |
| `SUM()` | Add up values | Total revenue |
| `AVG()` | Average value | Average product price |
| `MIN()` | Smallest value | Cheapest product |
| `MAX()` | Largest value | Most expensive product |

---

## COUNT

Count all rows:

```sql
SELECT COUNT(*) FROM users;
```

Count rows where a column is not NULL:

```sql
SELECT COUNT(age) FROM users;
```

Count distinct values (no duplicates):

```sql
SELECT COUNT(DISTINCT age) FROM users;
```

---

## SUM, AVG, MIN, MAX

Run each of these on the `products` table:

```sql
SELECT SUM(price)  AS total_value  FROM products;
SELECT AVG(price)  AS avg_price    FROM products;
SELECT MIN(price)  AS cheapest     FROM products;
SELECT MAX(price)  AS most_expensive FROM products;
```

You can combine them in one query:

```sql
SELECT
  COUNT(*)      AS total_products,
  SUM(stock)    AS total_stock,
  AVG(price)    AS avg_price,
  MIN(price)    AS cheapest,
  MAX(price)    AS most_expensive
FROM products;
```

---

## GROUP BY — Aggregating by Category

`GROUP BY` splits the rows into groups and runs the aggregate function on each group.

Add a `category` column to products first:

```sql
ALTER TABLE products ADD COLUMN category VARCHAR(50) DEFAULT 'general';

UPDATE products SET category = 'stationery' WHERE id IN (1, 2);
UPDATE products SET category = 'bags'       WHERE id = 3;
```

Now count products per category:

```sql
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category;
```

Total stock per category:

```sql
SELECT category, SUM(stock) AS total_stock
FROM products
GROUP BY category;
```

---

## HAVING — Filter After Grouping

`WHERE` filters rows before grouping.  
`HAVING` filters groups after grouping.

Show only categories with more than 1 product:

```sql
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING COUNT(*) > 1;
```

---

## Predict Before You Run

Given the products: Notebook (150, stock 200), Pen (20, stock 500), Backpack (850, stock 45):

1. What does `SELECT SUM(stock) FROM products;` return?
2. What does `SELECT AVG(price) FROM products;` return?
3. What does `SELECT MAX(price) - MIN(price) FROM products;` return?

<details>
<summary>Show answers</summary>

1. `745` (200 + 500 + 45)
2. `340.00` ((150 + 20 + 850) / 3)
3. `830.00` (850 - 20)

</details>

---

## Fill in the Blank

Write a query that returns the average price for each category, but only shows categories where the average price is above 100.

```sql
SELECT ___, AVG(___) AS avg_price
FROM products
GROUP BY ___
HAVING AVG(___) > ___;
```

<details>
<summary>Show answer</summary>

```sql
SELECT category, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 100;
```

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `SELECT name, COUNT(*) FROM products` without `GROUP BY` | Wrong results or error | If you use an aggregate, every non-aggregate column must be in `GROUP BY` |
| Using `WHERE` instead of `HAVING` to filter groups | No results or wrong results | `WHERE` = before grouping, `HAVING` = after grouping |
| `COUNT(column)` vs `COUNT(*)` | `COUNT(column)` skips NULLs | Use `COUNT(*)` to count all rows, `COUNT(column)` to count non-NULL values |

---

## When Things Go Wrong

**"Expression not in GROUP BY clause"**  
You selected a column that is not in the `GROUP BY` and not inside an aggregate function. Either add it to `GROUP BY` or wrap it in an aggregate.

**HAVING clause with a column alias from SELECT**  
Some databases do not allow this. Use the full expression: `HAVING AVG(price) > 100` not `HAVING avg_price > 100`.

---

## Checkpoint

- [ ] You counted rows with `COUNT(*)`
- [ ] You used `SUM`, `AVG`, `MIN`, `MAX` on the products table
- [ ] You used `GROUP BY` to group results by category
- [ ] You filtered groups with `HAVING`
- [ ] You know the difference between `WHERE` and `HAVING`

---

**Next lesson:** [12 — Relationships and Foreign Keys](./12-relationships-and-foreign-keys)
