---
sidebar_position: 2
---

# 01 — What is Python?

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain what Python is, run your first Python program, and understand why Python is one of the best first languages to learn.

---

## The Hook

You already know SQL — a language that talks to a database.  
Python is a language that talks to everything else.

It can build websites, automate tasks, analyse data, control hardware, and power AI.  
It is readable almost like plain English, which is why it is the most popular beginner language in the world — and also used by Google, Instagram, and NASA.

---

## What Python Looks Like

Here is a complete Python program that prints a greeting:

```python
name = "Alice"
print("Hello, " + name)
```

Output:
```
Hello, Alice
```

No semicolons. No curly braces. No type declarations. Just clear, readable code.

Compare the same logic in Java:
```java
public class Hello {
    public static void main(String[] args) {
        String name = "Alice";
        System.out.println("Hello, " + name);
    }
}
```

Python does the same thing in 2 lines instead of 6. That is not an accident — Python was designed to be readable first.

---

## What We Will Build in This Track

You will build a **REST API** — a backend server that the React frontend will talk to.

It connects to the same MySQL database you built in the SQL track.  
By the end, the Python API will handle: users, products, orders, and authentication.

---

## How Python Runs

Python is an **interpreted** language. That means:
1. You write code in a `.py` file
2. Python reads and runs it line by line — no compile step needed
3. You see results immediately

This makes it fast to experiment and learn.

---

## Verify Your Setup

Before moving on — open a terminal and run:

```bash
python --version
```

Or on some systems:

```bash
python3 --version
```

You should see something like `Python 3.11.0` or higher.  
If you see an error, go to the [Setup guide](../setup/intro) before continuing.

---

## Your First Program

Create a new file called `hello.py` anywhere on your computer. Write this inside it:

```python
print("Hello, World!")
```

Run it from your terminal:

```bash
python hello.py
```

You should see:
```
Hello, World!
```

That is it. You just ran Python.

---

## Predict Before You Run

What does this print?

```python
print(10 + 5)
print("10" + "5")
print(10 * 3)
```

Write your answers before running it.

<details>
<summary>Show answers</summary>

```
15
105
30
```

Line 1: adds two numbers → `15`  
Line 2: joins two strings → `"105"` (not addition — string concatenation)  
Line 3: multiplies → `30`

The difference between `10` and `"10"` matters. One is a number, one is text.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Running `python` when only `python3` is installed | `python: command not found` | Use `python3` instead, or set up an alias |
| Saving the file as `hello.txt` instead of `hello.py` | Python does not recognise it | File must end in `.py` |
| Mixing tabs and spaces for indentation | `IndentationError` | Pick one and stick to it — use spaces (4 per level) |

---

## When Things Go Wrong

**"python: command not found"**  
Python is not installed or not in your PATH. Follow the [Setup guide](../setup/intro).

**"SyntaxError: invalid syntax"**  
Python found something it cannot read. Read the error — it tells you the line number. Common cause: a missing quote, bracket, or a typo.

**The program runs but prints nothing**  
You probably wrote `Print` (capital P) instead of `print`. Python is case-sensitive.

---

## Checkpoint

- [ ] You verified Python is installed (`python --version`)
- [ ] You created `hello.py` and ran it
- [ ] You predicted the output of the three `print` statements and understood why
- [ ] You understand the difference between `10` (number) and `"10"` (string)

---

**Next lesson:** [02 — Variables and Data Types](./02-variables-and-data-types)
