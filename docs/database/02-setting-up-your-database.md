---
sidebar_position: 3
---

# 02 — Setting Up Your Database

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** install MySQL on your computer, start the database server, and open a MySQL session ready to write your first SQL.

---

## The Hook

A database lives on a **server** — a program that runs in the background and waits for instructions.  
Before you can write a single SQL command, that server needs to be running on your machine.

This is the only lesson that is mostly setup. Once it is done, you never do it again.

---

## What We Are Installing

We will install two things:

| Tool | What it does |
|------|-------------|
| **MySQL Server** | The database engine — stores and manages your data |
| **MySQL Workbench** | A visual interface to write SQL and see results |

---

## Installation

### Windows

1. Go to the MySQL official downloads page and download **MySQL Installer for Windows**
2. Run the installer and choose **Developer Default**
3. Follow the setup wizard — it installs both MySQL Server and Workbench
4. When asked to set a root password, choose something you will remember (e.g. `root1234`) — write it down
5. Finish the installation

### Mac

Open your terminal and run:

```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

If you do not have Homebrew, install it first from [brew.sh](https://brew.sh).

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

---

## Verify It Is Working

Open your terminal (or Command Prompt on Windows) and run:

```bash
mysql -u root -p
```

It will ask for your password. Type the one you set during installation.

If you see this, you are in:

```
Welcome to the MySQL monitor. Commands end with ; or \g.
mysql>
```

That `mysql>` prompt means MySQL is running and waiting for your commands.

To exit, type:

```sql
exit;
```

---

## Your First Two Commands

While you are in the MySQL prompt, run these:

```sql
SHOW DATABASES;
```

You should see a list of default databases MySQL creates. These are system databases — do not delete them.

```sql
SELECT VERSION();
```

This shows which version of MySQL is installed. Any version above 8.0 is fine.

---

## What Happens If...

- **What if mysql -u root -p says "command not found"?**  
  MySQL is not in your system PATH. On Windows, search for "MySQL Command Line Client" in the Start menu instead. On Mac/Linux, try `/usr/local/mysql/bin/mysql -u root -p`.

- **What if the password does not work?**  
  On Linux, try `sudo mysql` without a password — Linux often sets up MySQL with OS-level authentication by default.

- **What if MySQL Workbench cannot connect?**  
  Make sure the MySQL server is actually running. On Windows open Services and look for "MySQL80". On Mac run `brew services list`.

---

## Common Mistakes

| Mistake | How to Fix |
|---------|-----------|
| Forgetting the semicolon `;` at the end of commands | Every SQL statement ends with `;` — MySQL will just wait if you forget it |
| Using the wrong password | Reset it: stop the server, start with `--skip-grant-tables`, then update the password |
| Installing MySQL twice (via different methods) | Uninstall all versions and start fresh with one method |

---

## When Things Go Wrong

**"Can't connect to local MySQL server through socket"**  
The server is not running. Start it:
- Windows: `net start mysql` in Command Prompt as Administrator
- Mac: `brew services start mysql`
- Linux: `sudo systemctl start mysql`

**Blank screen / cursor stuck after typing password**  
This is normal — MySQL hides password characters. Just type your password and press Enter.

---

## Checkpoint

- [ ] MySQL Server is installed and running
- [ ] You can open a MySQL session with `mysql -u root -p`
- [ ] `SHOW DATABASES;` returns a list of databases
- [ ] You know how to exit with `exit;`

---

**Next lesson:** [03 — Creating Your First Table](./03-your-first-table)
