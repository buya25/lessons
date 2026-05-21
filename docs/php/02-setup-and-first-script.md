---
sidebar_position: 3
---

# 02 — Setup and First Script

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** install PHP, run a script from the terminal, and use the built-in development server.

---

## The Hook

PHP is already installed on most Linux servers. On your machine, you have two options:  
- **XAMPP / MAMP** — an all-in-one bundle (PHP + Apache + MySQL) — easier to start
- **PHP directly** — install PHP and use its built-in server — simpler, no Apache needed

This course uses **PHP directly + the built-in server**. It's how modern PHP development works.

---

## Install PHP

**Windows:**
```
https://windows.php.net/download/  →  download the x64 Thread Safe zip
Extract to C:\php
Add C:\php to your system PATH
```

Or use Chocolatey:
```bash
choco install php
```

**macOS:**
```bash
brew install php
```

**Ubuntu / Debian:**
```bash
sudo apt update
sudo apt install php php-mysql php-mbstring php-xml
```

Verify:
```bash
php --version
# PHP 8.2.x ...
```

---

## Install Composer

Composer is PHP's package manager — like `npm` for Node.js.

```bash
# Download and install
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"

# Move to a global location (Linux/macOS)
sudo mv composer.phar /usr/local/bin/composer

# Windows: move composer.phar to C:\php\composer.phar
# and add a composer.bat file that calls: php C:\php\composer.phar %*
```

Verify:
```bash
composer --version
# Composer version 2.x.x
```

---

## Your First Script

Create a file `hello.php`:

```php
<?php
echo "Hello, PHP!\n";
echo "Today is: " . date('Y-m-d') . "\n";
echo "PHP version: " . PHP_VERSION . "\n";
```

Run it from the terminal:
```bash
php hello.php
```

Output:
```
Hello, PHP!
Today is: 2025-01-15
PHP version: 8.2.14
```

PHP can run as a CLI script — you don't always need a web server.

---

## The Built-in Development Server

For web development, PHP has a built-in server — no Apache or Nginx needed during development:

```bash
# Start a server in the current directory on port 8000
php -S localhost:8000
```

Now create `index.php`:

```php
<?php
echo "<h1>It works!</h1>";
echo "<p>Time: " . date('H:i:s') . "</p>";
```

Open `http://localhost:8000` in your browser — you see the page.

---

## A Dynamic Page

```php
<?php
$name = $_GET['name'] ?? 'World';
$name = htmlspecialchars($name);  // ALWAYS sanitise input before outputting
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello</title>
</head>
<body>
  <h1>Hello, <?= $name ?>!</h1>
</body>
</html>
```

Visit `http://localhost:8000/?name=Alice` — you see "Hello, Alice!"

Two new concepts here:
- `$_GET['name']` — reads a query string parameter from the URL
- `htmlspecialchars()` — escapes dangerous characters before displaying user input (prevents XSS)

We'll cover both in depth in later lessons.

---

## Fill in the Blank

Complete this script so it prints the current day of the week:

```php
<?php
$day = ______('l');   // 'l' format gives full day name, e.g. "Monday"
echo "Today is: $day\n";
```

<details>
<summary>Answer</summary>

```php
$day = date('l');
```

`date()` takes a format string. Common formats:
- `'Y'` — 4-digit year
- `'m'` — month (01–12)
- `'d'` — day (01–31)
- `'H:i:s'` — time (hours:minutes:seconds)
- `'l'` — full day name

</details>

---

## Project Structure

For this track, create this folder structure:

```
blog/
├── public/          ← the web server's root — only this is publicly accessible
│   └── index.php    ← entry point
├── src/             ← application logic — not publicly accessible
├── templates/       ← HTML templates
├── .env             ← database credentials (never commit)
└── composer.json    ← PHP dependencies
```

Start the server pointing at the `public` folder:

```bash
php -S localhost:8000 -t public/
```

The `-t public/` flag means `public/index.php` is the root — files in `src/` cannot be accessed directly by URL.

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Starting server in the wrong folder | 404 everywhere | Use `-t public/` if your entry point is `public/` |
| Forgetting `<?php` at the top | PHP code printed as text | Every PHP file starts with `<?php` |
| `echo $_GET['name']` without sanitising | XSS vulnerability | Always `htmlspecialchars()` before outputting |
| Editing the wrong file | Changes don't appear | Check file paths, make sure no caching |

---

## Checkpoint

- [ ] `php --version` returns 8.x
- [ ] `composer --version` works
- [ ] You ran `hello.php` from the terminal
- [ ] You started `php -S localhost:8000` and saw a page in the browser
- [ ] You understand `$_GET` and why `htmlspecialchars()` is needed

---

**Next lesson:** [03 — Variables, Types, and Operators](./03-variables-types-operators)
