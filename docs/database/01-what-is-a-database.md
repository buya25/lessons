---
sidebar_position: 2
---

# 01 — What is a Database?

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain what a database is, why we need one, and identify the basic building blocks — tables, rows, and columns.

---

## The Hook

You have used a database today. Probably multiple times.

When you opened WhatsApp and your messages were still there — that's a database.  
When you searched YouTube and got results — that's a database.  
When your phone showed your contacts in alphabetical order — that's a database.

Every application that remembers something is using a database.  
The question is not *whether* you need one. The question is *how* to build one.

---

## The Concept

A database is just **organized storage for data**.

Think of it like a set of spreadsheets, but smarter:
- You can search through millions of rows in milliseconds
- You can connect data across multiple sheets
- Multiple people (or apps) can read and write at the same time
- It never loses data if your computer crashes

The language we use to talk to a database is called **SQL** (pronounced *sequel*).  
SQL stands for **Structured Query Language**.

You use SQL to:
- Create storage (tables)
- Add data (insert)
- Find data (select)
- Change data (update)
- Remove data (delete)

That's it. Everything you'll ever do in a database is one of those five things.

---

## The Building Blocks

A database is made of **tables**.  
A table is like a spreadsheet with rows and columns.

Here is what a `users` table looks like:

| id | name          | email                  | age |
|----|---------------|------------------------|-----|
| 1  | Alice Mwangi  | alice@email.com        | 24  |
| 2  | Brian Oduya   | brian@email.com        | 31  |
| 3  | Clara Ndung'u | clara@email.com        | 19  |

- Each **column** is a category of information (id, name, email, age)
- Each **row** is one person's record
- Every row has a unique **id** — this is how we tell records apart

A real application has many tables. An e-commerce app might have:
- `users` — everyone who has an account
- `products` — every item for sale
- `orders` — every purchase ever made
- `payments` — every transaction

The tables are connected. An order belongs to a user. A payment belongs to an order.
This is what makes databases powerful — the connections between tables.

---

## Predict Before You Read

Look at this `products` table:

| id | name        | price | stock |
|----|-------------|-------|-------|
| 1  | Notebook    | 150   | 200   |
| 2  | Pen         | 20    | 500   |
| 3  | Backpack    | 850   | 45    |

Answer these before scrolling down:

1. How many products are in this table?
2. Which product costs the most?
3. If someone buys 10 backpacks, what should the stock become?

*(These are the exact kinds of questions SQL answers — you will write that code soon.)*

---

## What Happens If...

Think about these and write your answers down before moving on:

- What happens if two users sign up with the same email address? Should that be allowed?
- What happens if a product's price is saved as `"850 shillings"` instead of just `850`?
- What happens if you delete a user who has existing orders?

There are no right or wrong answers yet — but these are real problems every database designer has to solve. You will solve all three of them in upcoming lessons.

---

## Common Mistakes

| Mistake | Why It Happens | What to Do Instead |
|---------|---------------|-------------------|
| Storing everything in one giant table | It feels simpler at first | Split data into separate tables with clear purposes |
| Not giving every row a unique id | Seems unnecessary early on | Always add an `id` column — you will regret skipping it |
| Using spaces in column names (`first name`) | Looks natural | Use underscores instead: `first_name` |
| Storing numbers as text (`"850"` not `850`) | Easy to miss | Always match the data type to the actual data |

---

## When Things Go Wrong

You have not written any SQL yet, so nothing can break yet — and that is intentional.  
This lesson is about building the mental model first.

If anything above was confusing, re-read the **Building Blocks** section and draw the tables on paper. Physically drawing a table with columns and rows before typing anything is one of the best habits a beginner can build.

---

## Checkpoint

Before moving to the next lesson, you should be able to answer:

- [ ] What is a database in plain English?
- [ ] What is SQL?
- [ ] What is a table? What is a row? What is a column?
- [ ] Why does every row need a unique id?
- [ ] Name two tables an e-commerce app would need

If you cannot answer any of these, re-read the section that covers it before continuing.

---

**Next lesson:** [02 — Setting Up Your Database](./02-setting-up-your-database)
