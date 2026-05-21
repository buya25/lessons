---
sidebar_position: 14
---

# 13 — Joining Tables

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** retrieve data from multiple tables in a single query using INNER JOIN and LEFT JOIN.

---

## The Hook

Your data is now spread across multiple tables — users, orders, order_items, products.  
But when you show a user their order history, you need data from all of them at once.

Fetching them separately and combining them in your app code is slow, fragile, and unnecessary.  
`JOIN` does it in a single query.

---

## INNER JOIN — Only Matching Rows

Returns rows that have a match in **both** tables.

Show all orders with the user's name:

```sql
SELECT orders.id, users.name, orders.total, orders.status
FROM orders
INNER JOIN users ON orders.user_id = users.id;
```

`ON orders.user_id = users.id` — this is the join condition. It tells MySQL which column connects the two tables.

Only orders with a valid, existing user will appear. If an order's `user_id` has no match in `users`, that order is excluded.

---

## Using Aliases to Clean Up Queries

Long table names make queries hard to read. Use short aliases:

```sql
SELECT o.id, u.name, o.total, o.status
FROM orders o
INNER JOIN users u ON o.user_id = u.id;
```

`orders o` means "call `orders` by the name `o` from here on". Same for `u`.

---

## LEFT JOIN — All Rows from the Left Table

Returns every row from the left table, and the matching row from the right table.  
If there is no match, the right side columns are `NULL`.

Show all users and their orders (including users with no orders):

```sql
SELECT u.name, o.id AS order_id, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

Clara has no orders. She still appears — with `NULL` in the order columns.

---

## INNER JOIN vs LEFT JOIN — Side by Side

| | INNER JOIN | LEFT JOIN |
|--|-----------|----------|
| Users with orders | Included | Included |
| Users without orders | Excluded | Included (NULLs on right) |
| Use when | You only care about matched records | You need all records from the left table |

---

## Join Three Tables

Show each order with the user name and a list of products:

```sql
SELECT
  u.name          AS customer,
  o.id            AS order_id,
  p.name          AS product,
  oi.quantity,
  oi.unit_price
FROM order_items oi
INNER JOIN orders   o ON oi.order_id   = o.id
INNER JOIN users    u ON o.user_id     = u.id
INNER JOIN products p ON oi.product_id = p.id;
```

One query. Four tables. Clean result.

---

## Predict Before You Run

Given:
- Alice has 2 orders
- Brian has 1 order
- Clara has 0 orders

1. How many rows does `INNER JOIN users to orders` return?
2. How many rows does `LEFT JOIN users to orders` return?

<details>
<summary>Show answers</summary>

1. **3 rows** — only Alice's 2 + Brian's 1 (Clara excluded, no match)
2. **4 rows** — Alice's 2 + Brian's 1 + Clara's 1 row with NULLs

</details>

---

## Fill in the Blank

Write a query that shows the name of each product, and the total quantity ordered across all orders.

```sql
SELECT p.___, SUM(oi.___) AS total_ordered
FROM order_items oi
INNER JOIN products ___ ON oi.product_id = ___.___ 
GROUP BY p.___;
```

<details>
<summary>Show answer</summary>

```sql
SELECT p.name, SUM(oi.quantity) AS total_ordered
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.id
GROUP BY p.name;
```

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Forgetting the `ON` condition | Cartesian product — every row joined to every row | Always specify `ON table1.col = table2.col` |
| Using `JOIN` when you need `LEFT JOIN` | Missing rows for unmatched records | Think about whether you need NULLs in the result |
| Ambiguous column names without table prefix | `ERROR: Column 'id' is ambiguous` | Always prefix: `u.id`, `o.id` etc. |
| Too many JOINs in one query | Hard to read and debug | Break complex queries into smaller ones while learning |

---

## When Things Go Wrong

**"Column 'id' in field list is ambiguous"**  
Both tables have a column called `id`. Prefix it: `u.id` or `o.id`.

**Query returns far more rows than expected**  
You probably forgot the `ON` clause or got the join condition wrong. A missing `ON` creates a cartesian product (every row × every row).

**LEFT JOIN returns NULLs where you expected data**  
Check that the foreign key values actually match. Run `SELECT` on both tables separately to verify.

---

## Checkpoint

- [ ] You joined `orders` and `users` with `INNER JOIN`
- [ ] You joined all three: `order_items`, `orders`, `users`, `products`
- [ ] You used `LEFT JOIN` and saw the NULL rows for Clara
- [ ] You understand when to use each type of join
- [ ] You completed the fill-in-the-blank

---

**Next lesson:** [14 — Indexes](./14-indexes)
