---
sidebar_position: 12
---

# 11 — Routing and URL Structure

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** implement clean URLs using a front controller, parse URL segments, and dispatch requests to the right handler.

---

## The Hook

Without routing, every page is a separate `.php` file:
```
/login.php
/register.php
/posts.php?id=5
```

With routing, URLs look like a real app:
```
/login
/register
/posts/5
```

One file handles all requests and dispatches to the right code.

---

## The Problem with PHP Files as Routes

By default, Apache/Nginx maps URLs to files:
- `/login.php` → runs `login.php`
- `/posts/show.php?id=5` → exposes your file structure

Problems:
- URLs change whenever you rename a file
- `?id=5` query strings are ugly
- PHP files in `public/` can be accessed directly — security risk

---

## The Front Controller Pattern

All requests go to one file — `public/index.php` — which decides what to do:

**Apache `.htaccess`:**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

**Nginx config:**
```nginx
location / {
  try_files $uri $uri/ /index.php?$query_string;
}
```

**PHP built-in server** (already does this — no config needed):
```bash
php -S localhost:8000 -t public/
```

---

## A Simple Router

```php
// public/index.php
<?php
declare(strict_types=1);

// Remove leading/trailing slashes and get path segments
$path   = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$method = $_SERVER['REQUEST_METHOD'];
$parts  = $path === '' ? [] : explode('/', $path);

// Simple dispatch table
match (true) {
  $method === 'GET'  && $path === ''            => home(),
  $method === 'GET'  && $path === 'login'        => showLoginForm(),
  $method === 'POST' && $path === 'login'        => processLogin(),
  $method === 'GET'  && $path === 'register'     => showRegisterForm(),
  $method === 'POST' && $path === 'register'     => processRegister(),
  $method === 'GET'  && $parts[0] === 'posts' && isset($parts[1]) => showPost((int) $parts[1]),
  $method === 'GET'  && $path === 'posts'        => listPosts(),
  default => notFound(),
};

function notFound(): void {
  http_response_code(404);
  require '../templates/404.php';
}
```

---

## A Cleaner Router Class

```php
// src/Router.php
<?php
declare(strict_types=1);

class Router {
  private array $routes = [];

  public function get(string $pattern, callable $handler): void {
    $this->routes[] = ['GET', $pattern, $handler];
  }

  public function post(string $pattern, callable $handler): void {
    $this->routes[] = ['POST', $pattern, $handler];
  }

  public function dispatch(string $method, string $uri): void {
    $path = trim(parse_url($uri, PHP_URL_PATH), '/');

    foreach ($this->routes as [$routeMethod, $pattern, $handler]) {
      if ($routeMethod !== $method) continue;

      // Convert :id to a named capture group
      $regex = preg_replace('/:[a-z]+/', '([^/]+)', $pattern);
      $regex = '#^' . $regex . '$#';

      if (preg_match($regex, $path, $matches)) {
        array_shift($matches);  // remove full match
        call_user_func_array($handler, $matches);
        return;
      }
    }

    http_response_code(404);
    require __DIR__ . '/../templates/404.php';
  }
}
```

Usage in `public/index.php`:

```php
<?php
require_once '../src/Router.php';
require_once '../src/controllers/PostController.php';

$router = new Router();

$router->get('',               fn() => (new PostController)->index());
$router->get('posts',          fn() => (new PostController)->index());
$router->get('posts/:id',      fn($id) => (new PostController)->show((int) $id));
$router->post('posts',         fn() => (new PostController)->store());
$router->get('login',          fn() => showLoginForm());
$router->post('login',         fn() => processLogin());

$router->dispatch(
  $_SERVER['REQUEST_METHOD'],
  $_SERVER['REQUEST_URI']
);
```

---

## Controllers

A controller handles a group of related routes:

```php
// src/controllers/PostController.php
<?php
declare(strict_types=1);

require_once '../src/Models/Post.php';
require_once '../src/Database.php';

class PostController {
  private Database $db;

  public function __construct() {
    $this->db = new Database();
  }

  public function index(): void {
    $rows  = $this->db->query('SELECT * FROM posts ORDER BY created_at DESC');
    $posts = array_map(fn($row) => Post::fromRow($row), $rows);
    require '../templates/posts/index.php';  // $posts is available in the template
  }

  public function show(int $id): void {
    $row = $this->db->queryOne('SELECT * FROM posts WHERE id = ?', [$id]);
    if (!$row) {
      http_response_code(404);
      require '../templates/404.php';
      return;
    }
    $post = Post::fromRow($row);
    require '../templates/posts/show.php';
  }
}
```

---

## Templates Access Variables

The controller requires a template file. Variables defined in the controller are accessible in the template because `require` runs in the same scope:

```php
<!-- templates/posts/show.php -->
<!DOCTYPE html>
<html>
<body>
  <h1><?= htmlspecialchars($post->title) ?></h1>
  <p><?= htmlspecialchars($post->content) ?></p>
</body>
</html>
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| No `.htaccess` or Nginx rewrite | `/posts/5` returns 404 | Configure the web server to route to `index.php` |
| Trusting URL segments without casting | `/posts/1 OR 1=1` | Cast to `(int)` and validate before use |
| Not calling `exit` after `header('Location:')` | Code continues running | Always `exit` after a redirect |
| Controller `require` fails | Blank page | Use `require_once` with absolute `__DIR__` paths |

---

## Checkpoint

- [ ] The built-in PHP server routes all requests to `public/index.php`
- [ ] Your router matches URL patterns and extracts parameters like `:id`
- [ ] Controllers handle related routes and pass data to templates
- [ ] You understand how `require` inside a method shares the local scope with templates

---

**Next lesson:** [12 — File Organisation](./12-file-organisation)
