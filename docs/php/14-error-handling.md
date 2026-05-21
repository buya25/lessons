---
sidebar_position: 15
---

# 14 — Error Handling

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** use try/catch, configure PHP's error modes, log errors properly, and show users friendly error pages.

---

## The Hook

A crashed PHP script shows a blank white page or a stack trace full of database credentials.  
Proper error handling means users see a friendly message, and you see the full details in a log file.

---

## PHP's Two Systems

PHP has two separate ways errors can be reported:

**1. Errors** (legacy) — from PHP itself and some extensions:
- `E_NOTICE`, `E_WARNING`, `E_ERROR`
- Old-style, not objects

**2. Exceptions** — object-oriented, thrown and caught:
- `throw new Exception("something went wrong")`
- `try { ... } catch (Exception $e) { ... }`

PDO with `ERRMODE_EXCEPTION` converts database errors into exceptions. Modern PHP prefers exceptions.

---

## try / catch / finally

```php
<?php
try {
  $result = divide(10, 0);
  echo $result;
} catch (DivisionByZeroError $e) {
  echo "Math error: " . $e->getMessage();
} catch (Exception $e) {
  echo "General error: " . $e->getMessage();
} finally {
  echo "This always runs";  // even if there's an exception
}

function divide(int $a, int $b): float {
  if ($b === 0) throw new DivisionByZeroError("Cannot divide by zero");
  return $a / $b;
}
```

- `catch` can match specific exception types
- Multiple `catch` blocks — PHP checks from top to bottom, uses the first match
- `finally` runs whether or not an exception was thrown

---

## Custom Exceptions

```php
// src/Exceptions/NotFoundException.php
<?php
namespace App\Exceptions;

class NotFoundException extends \RuntimeException {
  public function __construct(string $resource = 'Resource') {
    parent::__construct("$resource not found", 404);
  }
}

class ValidationException extends \RuntimeException {
  public function __construct(private array $errors) {
    parent::__construct('Validation failed', 422);
  }

  public function getErrors(): array {
    return $this->errors;
  }
}
```

Using them:
```php
public function show(int $id): void {
  $row = $this->db->queryOne('SELECT * FROM posts WHERE id = ?', [$id]);
  if (!$row) throw new NotFoundException('Post');
  // ...
}
```

---

## Global Error Handler

Set up a global handler in `public/index.php` to catch anything that slips through:

```php
<?php
require_once '../vendor/autoload.php';

use App\Exceptions\NotFoundException;

// Convert PHP errors to exceptions
set_error_handler(function (int $errno, string $errstr, string $file, int $line): bool {
  throw new \ErrorException($errstr, 0, $errno, $file, $line);
});

// Catch unhandled exceptions
set_exception_handler(function (\Throwable $e): void {
  error_log(sprintf(
    "[%s] %s in %s:%d\nStack trace:\n%s",
    date('Y-m-d H:i:s'),
    $e->getMessage(),
    $e->getFile(),
    $e->getLine(),
    $e->getTraceAsString()
  ));

  $status = $e->getCode() ?: 500;
  http_response_code(in_array($status, [400, 401, 403, 404, 422]) ? $status : 500);

  if ($_ENV['APP_ENV'] === 'production') {
    require '../templates/error.php';  // generic user-facing page
  } else {
    echo "<h1>Error: " . htmlspecialchars($e->getMessage()) . "</h1>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
  }
});
```

---

## Configuring Error Display

In `php.ini` or at the top of `public/index.php`:

```php
// Development — show everything
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Production — log everything, show nothing
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', '/var/log/php_errors.log');
error_reporting(E_ALL);
```

Set based on `$_ENV['APP_ENV']`:

```php
if ($_ENV['APP_ENV'] === 'production') {
  ini_set('display_errors', '0');
  ini_set('log_errors', '1');
  error_reporting(E_ALL);
} else {
  ini_set('display_errors', '1');
  error_reporting(E_ALL);
}
```

---

## Logging with error_log

```php
// Write to the configured error log
error_log("Payment failed for user {$userId}: {$e->getMessage()}");

// Write to a specific file
error_log("Something happened", 3, '/var/log/app.log');
```

For structured logging in larger apps, use Monolog:
```bash
composer require monolog/monolog
```

```php
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$log = new Logger('app');
$log->pushHandler(new StreamHandler('../storage/app.log', Logger::DEBUG));
$log->error('Payment failed', ['user_id' => $userId, 'error' => $e->getMessage()]);
```

---

## The PDO Exception

With `ERRMODE_EXCEPTION` set (lesson 08), every failed query throws a `PDOException`:

```php
try {
  $this->db->execute('INSERT INTO posts (title, content) VALUES (?, ?)', [$title, $content]);
} catch (\PDOException $e) {
  // Check for duplicate entry (MySQL error code 1062)
  if ($e->getCode() === '23000') {
    throw new ValidationException(['title' => 'A post with this title already exists']);
  }
  throw $e;  // re-throw anything we can't handle
}
```

---

## Break It

This error handler has two bugs. Find them both:

```php
set_exception_handler(function ($e) {
  error_log($e->getMessage());
  http_response_code(500);
  echo "<p>Error: " . $e->getMessage() . "</p>";
});
```

<details>
<summary>What is wrong?</summary>

1. **XSS** — `echo $e->getMessage()` outputs user-influenced content without `htmlspecialchars()`. If the exception message contains `<script>`, it executes.

2. **No check for `APP_ENV`** — in production, the error message should never be shown to users (exposes internals). Should show a generic message and log the details.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| `display_errors = On` in production | Exposes database credentials, file paths | Always `Off` in production |
| Catching `Exception` but not `Error` | PHP 7+ fatal errors (`TypeError`, etc.) not caught | Catch `\Throwable` to catch both |
| `die($e->getMessage())` in production | Leaks internals to the browser | Log the full message, show a generic one |
| Empty `catch` block | Exception silently swallowed | Always log or re-throw |

---

## Checkpoint

- [ ] `try/catch` used around database operations
- [ ] Custom exceptions created for 404 and validation errors
- [ ] Global `set_exception_handler` set in `index.php`
- [ ] `display_errors` off in production, errors written to a log file
- [ ] Exception messages not echoed directly in production

---

**Next lesson:** [15 — Security Essentials](./15-security)
