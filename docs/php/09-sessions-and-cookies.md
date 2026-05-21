---
sidebar_position: 10
---

# 09 — Sessions and Cookies

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** use PHP sessions to maintain login state across requests, and understand when to use cookies instead.

---

## The Hook

HTTP is stateless — every request is independent. The server doesn't remember you from one request to the next.

Sessions solve this: after you log in, the server remembers who you are for every subsequent request.

---

## How Sessions Work

```
1. User logs in
2. PHP creates a session: stores data on the server, assigns a session ID
3. Session ID is sent to the browser as a cookie: PHPSESSID=abc123
4. Browser sends PHPSESSID cookie on every request
5. PHP reads the cookie, looks up the session data on the server
6. User is "logged in" because their data is in the session
```

The browser only stores the ID. The actual data (user ID, name, role) lives on the server.

---

## Starting and Using a Session

```php
<?php
session_start();  // must be the first thing — before any output

// Store data
$_SESSION['user_id']   = 42;
$_SESSION['user_name'] = 'Alice';
$_SESSION['role']      = 'admin';

// Read data
echo $_SESSION['user_name'];  // Alice

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
  header('Location: /login');
  exit;
}

// Remove one value
unset($_SESSION['user_name']);

// Destroy the entire session (logout)
session_destroy();
```

`session_start()` must run before any HTML output (including whitespace before `<?php`). If you see "Cannot send session cookie — headers already sent", there's output before `session_start()`.

---

## Login Flow

```php
<?php
// public/login.php
declare(strict_types=1);
session_start();

require_once '../src/Database.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email    = trim($_POST['email']    ?? '');
  $password = trim($_POST['password'] ?? '');

  if ($email === '' || $password === '') {
    $errors[] = 'Email and password are required';
  } else {
    $db   = new Database();
    $user = $db->queryOne('SELECT * FROM users WHERE email = ?', [$email]);

    if ($user && password_verify($password, $user['password_hash'])) {
      // Success — regenerate session ID before storing sensitive data
      session_regenerate_id(true);

      $_SESSION['user_id']   = $user['id'];
      $_SESSION['user_name'] = $user['name'];
      $_SESSION['role']      = $user['role'];

      header('Location: /dashboard');
      exit;
    } else {
      $errors[] = 'Invalid email or password';
    }
  }
}
?>
```

`session_regenerate_id(true)` — generates a new session ID and deletes the old one. This prevents **session fixation attacks** — always call this right before storing login data.

---

## Logout

```php
<?php
// public/logout.php
session_start();

// Unset all session variables
$_SESSION = [];

// Delete the session cookie
if (ini_get('session.use_cookies')) {
  $params = session_get_cookie_params();
  setcookie(
    session_name(),
    '',
    time() - 42000,
    $params['path'],
    $params['domain'],
    $params['secure'],
    $params['httponly']
  );
}

session_destroy();

header('Location: /login');
exit;
```

---

## Auth Middleware — Protecting Pages

Create a reusable auth check:

```php
// src/auth.php
<?php
function requireLogin(): void {
  if (session_status() === PHP_SESSION_NONE) {
    session_start();
  }
  if (!isset($_SESSION['user_id'])) {
    header('Location: /login');
    exit;
  }
}

function requireRole(string $role): void {
  requireLogin();
  if ($_SESSION['role'] !== $role) {
    http_response_code(403);
    die('Access denied');
  }
}
```

Any protected page starts with:
```php
<?php
require_once '../src/auth.php';
requireLogin();

// Only logged-in users reach here
echo "Welcome, " . htmlspecialchars($_SESSION['user_name']);
```

---

## Cookies

Cookies are stored in the browser — the server sets them, the browser sends them back.  
Sessions use a cookie too (just the session ID). Use raw cookies for:
- Persistent "remember me" tokens
- User preferences (theme, language)
- Analytics

```php
// Set a cookie (expires in 30 days)
setcookie(
  'theme',         // name
  'dark',          // value
  time() + 30 * 24 * 60 * 60,  // expiry (Unix timestamp)
  '/',             // path
  '',              // domain ('' = current)
  true,            // secure (HTTPS only)
  true             // httpOnly (not accessible by JavaScript)
);

// Read it
$theme = $_COOKIE['theme'] ?? 'light';

// Delete it
setcookie('theme', '', time() - 3600);
```

Always set `httpOnly: true` for cookies that PHP reads — JavaScript should not access session or auth cookies.

---

## Sessions vs Cookies

| | Session | Cookie |
|-|---------|--------|
| Where stored | Server | Browser |
| Size limit | No practical limit | ~4 KB |
| Security | Better (data not in browser) | OK with httpOnly + Secure |
| Persists after browser close | No (by default) | Yes (if expiry set) |
| Use for | Login state | Preferences, remember-me |

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Output before `session_start()` | "Headers already sent" error | Put `session_start()` before any echo or HTML |
| No `session_regenerate_id()` on login | Session fixation attack possible | Always regenerate after login |
| Storing sensitive data in cookies | User can read/modify it | Store only an ID in cookies, keep data server-side |
| Not deleting cookie on logout | Browser still has old session cookie | Call `setcookie()` with past expiry |

---

## Checkpoint

- [ ] You can start a session, store values, and read them on the next page
- [ ] Login stores `user_id` in `$_SESSION` after `session_regenerate_id(true)`
- [ ] Logout calls `session_destroy()` and deletes the session cookie
- [ ] `requireLogin()` helper redirects unauthenticated users

---

**Next lesson:** [10 — Object-Oriented PHP](./10-oop)
