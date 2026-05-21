---
sidebar_position: 13
---

# 12 — File Organisation

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** structure a PHP project with autoloading, separate concerns into layers, and use Composer to manage dependencies.

---

## The Hook

A PHP file with 500 lines that does routing, database queries, and HTML is impossible to maintain.

Separating concerns — routing, models, controllers, templates — makes each file focused and findable.

---

## The Folder Structure

```
blog/
├── public/                  ← web root — ONLY this is web-accessible
│   ├── index.php            ← front controller (all requests)
│   └── assets/              ← CSS, JS, images
│       └── style.css
│
├── src/                     ← PHP classes — not web-accessible
│   ├── Controllers/
│   │   ├── PostController.php
│   │   └── AuthController.php
│   ├── Models/
│   │   ├── Post.php
│   │   └── User.php
│   ├── Database.php
│   └── Router.php
│
├── templates/               ← HTML templates — not web-accessible
│   ├── layout.php           ← shared header/footer
│   ├── posts/
│   │   ├── index.php
│   │   └── show.php
│   └── auth/
│       ├── login.php
│       └── register.php
│
├── vendor/                  ← Composer packages — never edit manually
├── .env                     ← credentials (gitignored)
├── .gitignore
└── composer.json
```

Only `public/` is served by the web server. Even if someone guesses `/src/Database.php`, the web server returns 404.

---

## Composer Autoloading

Without autoloading, every file needs manual `require`:
```php
require_once '../src/Database.php';
require_once '../src/Models/Post.php';
require_once '../src/Controllers/PostController.php';
```

Composer's autoloader does this automatically — just use the class.

**`composer.json`:**
```json
{
  "name": "blog/app",
  "require": {
    "php": ">=8.1"
  },
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

Generate the autoloader:
```bash
composer dump-autoload
```

Now, in `src/Models/Post.php`:
```php
<?php
namespace App\Models;

class Post {
  // ...
}
```

And in any file:
```php
<?php
require_once '../vendor/autoload.php';  // once, at the very top

use App\Models\Post;
use App\Controllers\PostController;

// No more require_once for each class
$post = new Post(/* ... */);
```

---

## PSR-4 Namespaces

The PSR-4 standard maps namespaces to folders:

| Namespace | Maps to | File |
|-----------|---------|------|
| `App\Models\Post` | `src/Models/` | `Post.php` |
| `App\Controllers\AuthController` | `src/Controllers/` | `AuthController.php` |
| `App\Database` | `src/` | `Database.php` |

Rules:
- Namespace must match the folder path exactly (case-sensitive)
- File name must match the class name exactly
- One class per file

---

## The Layout Template

Avoid copying the `<head>` and `<nav>` into every template:

```php
<!-- templates/layout.php -->
<?php function renderLayout(string $title, callable $content): void { ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?= htmlspecialchars($title) ?> — Blog</title>
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/posts">Posts</a>
    <?php if (isset($_SESSION['user_id'])): ?>
      <a href="/logout">Logout</a>
    <?php else: ?>
      <a href="/login">Login</a>
    <?php endif; ?>
  </nav>

  <main>
    <?php $content(); ?>
  </main>

  <footer>© <?= date('Y') ?></footer>
</body>
</html>
<?php } ?>
```

Usage in a controller:
```php
// src/Controllers/PostController.php
require_once '../templates/layout.php';

public function index(): void {
  $posts = $this->postService->getAll();
  renderLayout('All Posts', function() use ($posts) {
    require '../templates/posts/index.php';
  });
}
```

---

## Installing a Composer Package

```bash
composer require vlucas/phpdotenv
```

This adds the package to `composer.json` and installs it in `vendor/`.

Use it in `public/index.php`:
```php
<?php
require_once '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();
$dotenv->required(['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']);

// Now process.env equivalents are available:
$host = $_ENV['DB_HOST'];
```

---

## What Goes Where

| Where | What belongs there |
|-------|-------------------|
| `public/index.php` | Require autoloader, load env, create router, dispatch |
| `src/Router.php` | Route registration and dispatch logic |
| `src/Controllers/` | Read request, call model/service, require template |
| `src/Models/` | Data classes — no database logic |
| `src/Services/` (optional) | Business logic — queries, validation, transformations |
| `src/Database.php` | PDO connection and query helpers |
| `templates/` | HTML + minimal PHP (`foreach`, `if`, `echo`) |
| `.env` | Credentials — never in `src/` or `public/` |

---

## What NOT to Put in Templates

Templates should only display data — no database queries, no business logic:

```php
<!-- Bad — database query in a template -->
<?php
$posts = $db->query('SELECT * FROM posts');
foreach ($posts as $post): ?>
  <h2><?= h($post['title']) ?></h2>
<?php endforeach; ?>

<!-- Good — controller fetched $posts, template only displays -->
<?php foreach ($posts as $post): ?>
  <h2><?= h($post->title) ?></h2>
<?php endforeach; ?>
```

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Namespace doesn't match folder | Autoloader can't find class | Namespace must be exact: `App\Models\Post` → `src/Models/Post.php` |
| Forgetting `composer dump-autoload` after adding a class | Class not found | Run it whenever you add a new class |
| Database queries in templates | Logic mixed with display | Move queries to controllers or services |
| Public folder has `src/` or `templates/` inside | Files web-accessible | Only `public/` is the web root |

---

## Checkpoint

- [ ] Project uses the folder structure above — `public/`, `src/`, `templates/`
- [ ] `composer.json` configured with PSR-4 autoloading
- [ ] Classes use `namespace App\...` matching their folder path
- [ ] `vendor/autoload.php` required once in `public/index.php`
- [ ] Templates contain only display logic, no database calls

---

**Next lesson:** [13 — Password Hashing and Auth](./13-auth)
