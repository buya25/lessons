---
sidebar_position: 13
---

# 12 — Relationships and Foreign Keys

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** design tables that connect to each other, use foreign keys to enforce those connections, and identify the three types of relationships.

---

## The Hook

Right now your `users` and `products` tables are islands — completely separate.  
But in real life, a user places an order, and that order contains products.

If you store everything in one table, you repeat the user's name and address on every single order. Change their address once and you have to update hundreds of rows. Miss one and your data is inconsistent.

The solution is **relationships** — tables that reference each other.

---

## The Three Types of Relationships

### One-to-Many (most common)
One user can have many orders. One order belongs to one user.  
→ Store the user's `id` in the `orders` table.

### One-to-One
One user has one profile. One profile belongs to one user.  
→ Store the user's `id` in the `profiles` table.

### Many-to-Many
One order can contain many products. One product can appear in many orders.  
→ Create a third table (called a junction table) that stores both IDs.

---

## Foreign Keys

A **foreign key** is a column in one table that points to the `PRIMARY KEY` of another table.

It enforces a rule: you cannot store a value in the foreign key column that does not exist in the referenced table.

---

## Create the Orders Table (One-to-Many)

```sql
CREATE TABLE orders (
  id         INT           NOT NULL AUTO_INCREMENT,
  user_id    INT           NOT NULL,
  total      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status     VARCHAR(20)   NOT NULL DEFAULT 'pending',
  created_at DATETIME      DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

The line `FOREIGN KEY (user_id) REFERENCES users(id)` means:
- `user_id` in `orders` must match an existing `id` in `users`
- You cannot create an order for a user that does not exist

---

## Test the Foreign Key

Try to create an order for a user that does not exist:

```sql
INSERT INTO orders (user_id, total) VALUES (999, 150.00);
```

You will get: `ERROR 1452: Cannot add or update a child row: a foreign key constraint fails`  
The database protected you.

Now create a real order:

```sql
INSERT INTO orders (user_id, total, status) VALUES (1, 150.00, 'pending');
INSERT INTO orders (user_id, total, status) VALUES (1, 870.00, 'completed');
INSERT INTO orders (user_id, total, status) VALUES (2, 20.00,  'pending');
```

User 1 (Alice) has two orders. User 2 (Brian) has one.

---

## ON DELETE — What Happens When a Parent Row is Deleted?

```sql
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

| Option | What happens when the parent (user) is deleted |
|--------|-----------------------------------------------|
| `RESTRICT` (default) | Blocks the delete — cannot delete a user with orders |
| `CASCADE` | Automatically deletes all the user's orders too |
| `SET NULL` | Sets `user_id` to NULL in orders (only if column allows NULL) |

For most apps: use `RESTRICT` by default. Use `CASCADE` only when child data is meaningless without the parent (e.g. profile photos, sessions).

---

## Many-to-Many — The Junction Table

An order contains multiple products. A product appears in multiple orders.  
Neither table stores the other's ID directly — you need a third table.

```sql
CREATE TABLE order_items (
  id         INT           NOT NULL AUTO_INCREMENT,
  order_id   INT           NOT NULL,
  product_id INT           NOT NULL,
  quantity   INT           NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
```

Add items to order 1 (Alice's first order):

```sql
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (1, 1, 1, 150.00);  -- 1 Notebook
```

---

## Predict Before You Run

Given our tables — what do you think happens if you run:

```sql
DELETE FROM users WHERE id = 1;
```

Try it. Then check `SELECT * FROM orders;`

<details>
<summary>What happened?</summary>

You get `ERROR 1451: Cannot delete or update a parent row: foreign key constraint fails`  
The database blocked the delete because Alice has orders. This is `RESTRICT` in action.

If you want to delete Alice AND her orders, you would need `ON DELETE CASCADE` on the foreign key, or delete the orders first, then delete the user.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Creating a foreign key before the referenced table exists | Error creating table | Always create parent tables first |
| Referencing a column that is not a PRIMARY KEY or UNIQUE | Error | Foreign keys must point to a unique column |
| Forgetting `ON DELETE` rules | Unexpected behaviour when deleting | Decide explicitly: RESTRICT, CASCADE, or SET NULL |
| No junction table for many-to-many | Repeated data, impossible queries | Always use a junction table |

---

## When Things Go Wrong

**"Cannot add foreign key constraint"**  
Most common causes: the referenced table does not exist yet, or the data types of the two columns do not match exactly (both must be `INT`, or both `VARCHAR(150)`, etc.).

**"Cannot delete or update a parent row"**  
The row you are deleting has children. Delete the children first, or use `ON DELETE CASCADE`.

---

## Checkpoint

- [ ] You created the `orders` table with a foreign key to `users`
- [ ] You confirmed a foreign key blocks an invalid insert
- [ ] You created the `order_items` junction table
- [ ] You understand the three relationship types
- [ ] You know the difference between `ON DELETE RESTRICT` and `CASCADE`

---

**Next lesson:** [13 — Joining Tables](./13-joining-tables)
