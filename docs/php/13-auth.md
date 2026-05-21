---
sidebar_position: 14
---

# 13 — Password Hashing and Authentication

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** hash passwords correctly, implement register/login/logout, and protect routes with an auth guard.

---

## The Hook

If you store passwords as plain text, one database leak exposes every user's password.  
If you store them as MD5 or SHA1, they can be cracked with rainbow tables in seconds.

PHP's `password_hash()` uses bcrypt by default — the gold standard for password storage.

---

## How bcrypt Works

```php
$hash = password_hash('mysecret', PASSWORD_BCRYPT, ['cost' => 12]);
// $2y$12$eImiTXuWVxfM37uY4JANjQ...  (60-char string)
```

- The hash includes the **algorithm**, **cost factor**, and **salt** — all in one string
- The same password hashed twice gives different hashes (random salt)
- Verification uses `password_verify()` — you never compare hashes directly

```php
password_verify('mysecret', $hash)   // true
password_verify('wrong',   $hash)    // false
```

**Cost factor:** higher = slower = harder to brute-force. Cost 12 takes ~0.3 seconds on a modern CPU — fast enough for users, slow enough for attackers. Use at least 12.

---

## Registration

```php
// src/Controllers/AuthController.php
<?php
namespace App\Controllers;

use App\Database;

class AuthController {
  public function __construct(private Database $db) {}

  public function showRegister(): void {
    require '../templates/auth/register.php';
  }

  public function register(): void {
    $errors = [];
    $name     = trim($_POST['name']     ?? '');
    $email    = trim($_POST['email']    ?? '');
    $password =      $_POST['password'] ?? '';

    if ($name === '') $errors['name'] = 'Name is required';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Invalid email';
    if (strlen($password) < 8) $errors['password'] = 'Password must be at least 8 characters';

    if (empty($errors)) {
      // Check if email already exists
      $existing = $this->db->queryOne('SELECT id FROM users WHERE email = ?', [$email]);
      if ($existing) {
        $errors['email'] = 'This email is already registered';
      }
    }

    if (!empty($errors)) {
      $old = compact('name', 'email');
      require '../templates/auth/register.php';
      return;
    }

    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $this->db->execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [$name, $email, $hash]
    );

    // Log the new user in immediately
    $user = $this->db->queryOne('SELECT * FROM users WHERE email = ?', [$email]);
    $this->startSession($user);

    header('Location: /dashboard');
    exit;
  }

  public function showLogin(): void {
    require '../templates/auth/login.php';
  }

  public function login(): void {
    $email    = trim($_POST['email']    ?? '');
    $password =      $_POST['password'] ?? '';
    $errors   = [];

    $user = $this->db->queryOne('SELECT * FROM users WHERE email = ?', [$email]);

    // Same error for wrong email and wrong password — don't reveal which one
    if (!$user || !password_verify($password, $user['password_hash'])) {
      $errors['auth'] = 'Invalid email or password';
      require '../templates/auth/login.php';
      return;
    }

    $this->startSession($user);
    header('Location: /dashboard');
    exit;
  }

  public function logout(): void {
    session_start();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
      $p = session_get_cookie_params();
      setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    header('Location: /login');
    exit;
  }

  private function startSession(array $user): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    session_regenerate_id(true);
    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['role']      = $user['role'] ?? 'user';
  }
}
```

---

## Auth Guard

```php
// src/Auth.php
<?php
namespace App;

class Auth {
  public static function check(): bool {
    if (session_status() === PHP_SESSION_NONE) session_start();
    return isset($_SESSION['user_id']);
  }

  public static function user(): array|null {
    if (!self::check()) return null;
    return [
      'id'   => $_SESSION['user_id'],
      'name' => $_SESSION['user_name'],
      'role' => $_SESSION['role'],
    ];
  }

  public static function require(): void {
    if (!self::check()) {
      header('Location: /login');
      exit;
    }
  }

  public static function requireAdmin(): void {
    self::require();
    if ($_SESSION['role'] !== 'admin') {
      http_response_code(403);
      require '../templates/403.php';
      exit;
    }
  }
}
```

Protecting a controller method:
```php
public function create(): void {
  Auth::require();   // redirects to /login if not authenticated

  $user = Auth::user();
  // $user['id'], $user['name'] are available
  require '../templates/posts/create.php';
}
```

---

## Remember Me — Persistent Login

Sessions expire when the browser closes. "Remember me" uses a long-lived cookie:

```php
private function startSession(array $user, bool $remember = false): void {
  if (session_status() === PHP_SESSION_NONE) session_start();
  session_regenerate_id(true);
  $_SESSION['user_id'] = $user['id'];
  $_SESSION['role']    = $user['role'];

  if ($remember) {
    // Store a secure token in the database and in a cookie
    $token = bin2hex(random_bytes(32));  // 64-char hex string
    $this->db->execute(
      'INSERT INTO remember_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [$user['id'], hash('sha256', $token), date('Y-m-d', strtotime('+30 days'))]
    );
    setcookie('remember', $token, time() + 30 * 24 * 3600, '/', '', true, true);
  }
}
```

On every request, if there's no session but there is a `remember` cookie, look up the token and log the user in automatically.

---

## Predict Before You Run

```php
<?php
$hash1 = password_hash('secret', PASSWORD_BCRYPT);
$hash2 = password_hash('secret', PASSWORD_BCRYPT);
echo ($hash1 === $hash2) ? 'same' : 'different';
echo "\n";
echo password_verify('secret', $hash1) ? 'match' : 'no match';
```

<details>
<summary>Answer</summary>

```
different
match
```

Every call to `password_hash` generates a new random salt, producing a different hash each time. But `password_verify` still returns `true` because it extracts the salt from the stored hash and re-runs the algorithm.

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Storing plain text passwords | One breach exposes all users | Always `password_hash()` |
| MD5/SHA1 for passwords | Rainbow table crack in seconds | Use `PASSWORD_BCRYPT` or `PASSWORD_ARGON2ID` |
| Different error for wrong email vs wrong password | Reveals which emails are registered | Same error message for both cases |
| Not calling `session_regenerate_id()` | Session fixation attack | Regenerate on every login |

---

## Checkpoint

- [ ] Passwords stored with `password_hash($pass, PASSWORD_BCRYPT, ['cost' => 12])`
- [ ] Login uses `password_verify()` — never compares hashes directly
- [ ] Same error message for wrong email and wrong password
- [ ] `session_regenerate_id(true)` called on every successful login
- [ ] `Auth::require()` guard protects private routes

---

**Next lesson:** [14 — Error Handling](./14-error-handling)
