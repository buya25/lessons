---
sidebar_position: 16
---

# 15 — Transactions

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** wrap multiple SQL statements into a transaction that either fully succeeds or fully rolls back — with no partial state left behind.

---

## The Hook

Alice buys a Notebook. Two things must happen:
1. Deduct 150.00 from her account balance
2. Reduce the notebook's stock by 1

What if step 1 succeeds but step 2 fails due to a network error?  
Alice paid but the stock was never reduced. The data is now wrong.

A **transaction** makes multiple statements behave like one. Either all of them succeed, or none of them do.

---

## The Three Commands

```sql
START TRANSACTION;  -- begin a transaction
COMMIT;             -- save all changes permanently
ROLLBACK;           -- undo all changes since START TRANSACTION
```

---

## Basic Example

```sql
START TRANSACTION;

UPDATE products SET stock = stock - 1 WHERE id = 1;
INSERT INTO orders (user_id, total, status) VALUES (1, 150.00, 'completed');

COMMIT;
```

Both statements run. If `COMMIT` succeeds, both changes are permanent.

---

## ROLLBACK — Undo Everything

```sql
START TRANSACTION;

UPDATE products SET stock = stock - 1 WHERE id = 1;

-- Something went wrong — undo everything
ROLLBACK;
```

The stock update is reversed. The database is back to its state before `START TRANSACTION`.

---

## See It In Action

Run this step by step:

```sql
-- Check the current stock
SELECT id, name, stock FROM products WHERE id = 1;

-- Start a transaction
START TRANSACTION;

-- Reduce stock
UPDATE products SET stock = stock - 10 WHERE id = 1;

-- Check again inside the transaction
SELECT id, name, stock FROM products WHERE id = 1;

-- Decide to undo it
ROLLBACK;

-- Check again after rollback
SELECT id, name, stock FROM products WHERE id = 1;
```

The stock goes down inside the transaction, then returns to the original value after `ROLLBACK`.

---

## ACID — What Transactions Guarantee

Every database transaction is designed to be **ACID**:

| Letter | Property | Plain English |
|--------|---------|--------------|
| **A** | Atomicity | All or nothing — no partial updates |
| **C** | Consistency | The database is always in a valid state |
| **I** | Isolation | Transactions do not interfere with each other |
| **D** | Durability | Once committed, data survives crashes |

You do not need to implement ACID — MySQL handles it. But knowing what it means helps you understand why transactions exist.

---

## Real Example — Placing an Order

This is close to what a real e-commerce app does when a user checks out:

```sql
START TRANSACTION;

-- 1. Create the order
INSERT INTO orders (user_id, total, status)
VALUES (1, 150.00, 'pending');

-- 2. Get the new order's ID
SET @order_id = LAST_INSERT_ID();

-- 3. Add the item to order_items
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (@order_id, 1, 1, 150.00);

-- 4. Reduce stock
UPDATE products SET stock = stock - 1 WHERE id = 1;

-- 5. All good — commit
COMMIT;
```

If any step fails, run `ROLLBACK` and the user's order is cancelled cleanly — no half-created orders, no phantom stock reductions.

---

## What Happens If...

**What if you close the connection without COMMIT or ROLLBACK?**  
MySQL automatically rolls back any open transaction when the connection closes.

**What if two users try to buy the last item simultaneously?**  
Transactions handle this via isolation. The second transaction waits or fails cleanly depending on the isolation level. This is an advanced topic, but the short answer is: transactions protect you from this.

---

## Savepoints — Partial Rollback

You can roll back to a specific point without undoing everything:

```sql
START TRANSACTION;

INSERT INTO orders (user_id, total) VALUES (1, 500.00);
SAVEPOINT after_order;

UPDATE products SET stock = stock - 1 WHERE id = 1;

-- Only roll back the product update, keep the order
ROLLBACK TO SAVEPOINT after_order;

COMMIT;  -- commits the order but not the stock update
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Forgetting `COMMIT` | Changes are invisible to others and lost on disconnect | Always end with `COMMIT` or `ROLLBACK` |
| Long-running open transactions | Locks tables, blocks other users | Keep transactions short — only include what must be atomic |
| Using transactions for single statements | Unnecessary overhead | Single statements are already atomic in MySQL |
| Not handling errors in application code | Transaction left open | Always catch errors and call `ROLLBACK` in your backend code |

---

## When Things Go Wrong

**"This command is not allowed when transaction is in progress"**  
Some statements (like `CREATE TABLE`) cannot run inside a transaction in MySQL. Move them outside.

**Data changes are not visible to other users**  
You have an open transaction that has not been committed yet. Run `COMMIT` or `ROLLBACK`.

---

## Checkpoint

- [ ] You ran a transaction with `START TRANSACTION`, changes, and `COMMIT`
- [ ] You ran a `ROLLBACK` and confirmed the changes were undone
- [ ] You can explain what ACID stands for in plain English
- [ ] You understand why transactions matter for operations with multiple steps
- [ ] You wrote the order placement transaction

---

**Next:** [Project — E-commerce Database](./project-e-commerce-db)
