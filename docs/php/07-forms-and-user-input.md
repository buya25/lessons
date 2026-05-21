---
sidebar_position: 8
---

# 07 — Forms and User Input

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** read GET and POST data, validate user input, and safely display it on the page.

---

## The Hook

Every time a user types into a form and clicks submit, that data travels to your PHP script.  
If you trust it blindly, you've opened a security hole.  
If you validate and sanitise it properly, you've built a real feature.

---

## How Forms Send Data

**GET** — appended to the URL: `?name=Alice&age=25`  
Used for searches and filters — data is visible in the URL and can be bookmarked.

**POST** — sent in the request body — not visible in the URL.  
Used for creating/updating data, login, anything with passwords.

```html
<!-- GET form -->
<form method="GET" action="/search">
  <input type="text" name="q" placeholder="Search...">
  <button type="submit">Search</button>
</form>

<!-- POST form -->
<form method="POST" action="/login">
  <input type="email"    name="email">
  <input type="password" name="password">
  <button type="submit">Login</button>
</form>
```

---

## Reading Form Data

```php
<?php
// Read from GET (?name=Alice)
$name = $_GET['name'] ?? '';

// Read from POST (form submission)
$email    = $_POST['email']    ?? '';
$password = $_POST['password'] ?? '';

// Read from either (not recommended — be explicit)
$value = $_REQUEST['field'] ?? '';
```

Always use `?? ''` — if the field is missing, `$_GET['name']` throws an undefined index notice. The null coalescing operator provides a safe default.

---

## Validation

Never trust user input. Always validate before using it:

```php
<?php
$errors = [];

$name  = trim($_POST['name']  ?? '');
$email = trim($_POST['email'] ?? '');
$age   = (int) ($_POST['age'] ?? 0);

if ($name === '') {
  $errors['name'] = 'Name is required';
} elseif (strlen($name) > 100) {
  $errors['name'] = 'Name must be 100 characters or fewer';
}

if ($email === '') {
  $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errors['email'] = 'Invalid email address';
}

if ($age < 1 || $age > 120) {
  $errors['age'] = 'Age must be between 1 and 120';
}

if (empty($errors)) {
  // All valid — save to database, redirect, etc.
} else {
  // Show errors to user
}
```

---

## Sanitisation — Before Displaying

**Displaying user input in HTML without sanitising = XSS vulnerability.**

```php
// Dangerous — if $name = '<script>alert("hacked")</script>'
echo $name;

// Safe — converts < > " ' & to HTML entities
echo htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
```

Make it a habit: every time you `echo` something that came from user input, wrap it in `htmlspecialchars()`.

Shortcut — create a helper:
```php
function h(string $value): string {
  return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

echo h($name);
```

---

## Full Form Example — Post-Redirect-Get Pattern

The **Post-Redirect-Get** (PRG) pattern prevents form resubmission on browser refresh:

```php
<?php
// public/register.php
session_start();
$errors = [];
$old    = [];  // repopulate form fields after error

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $old['name']  = trim($_POST['name']  ?? '');
  $old['email'] = trim($_POST['email'] ?? '');

  if ($old['name'] === '') $errors['name'] = 'Name is required';
  if (!filter_var($old['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email';
  }

  if (empty($errors)) {
    // Save to database...
    header('Location: /success');  // redirect on success
    exit;
  }
  // If errors, fall through and re-render the form
}
?>
<!DOCTYPE html>
<html>
<body>

<form method="POST">
  <div>
    <label>Name</label>
    <input type="text" name="name" value="<?= h($old['name'] ?? '') ?>">
    <?php if (isset($errors['name'])): ?>
      <span class="error"><?= h($errors['name']) ?></span>
    <?php endif; ?>
  </div>

  <div>
    <label>Email</label>
    <input type="email" name="email" value="<?= h($old['email'] ?? '') ?>">
    <?php if (isset($errors['email'])): ?>
      <span class="error"><?= h($errors['email']) ?></span>
    <?php endif; ?>
  </div>

  <button type="submit">Register</button>
</form>

</body>
</html>
<?php
function h(string $v): string {
  return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}
```

Key points:
1. Check `$_SERVER['REQUEST_METHOD'] === 'POST'` to know if it's a submission
2. Re-populate form fields with `$old` so users don't re-type everything
3. Redirect on success — browser refresh won't resubmit
4. `exit` after `header('Location: ...')` — otherwise PHP continues running

---

## File Uploads via Forms

```html
<!-- enctype is required for file uploads -->
<form method="POST" enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/*">
  <button type="submit">Upload</button>
</form>
```

```php
<?php
if (isset($_FILES['avatar'])) {
  $file     = $_FILES['avatar'];
  $allowed  = ['image/jpeg', 'image/png', 'image/webp'];
  $maxBytes = 5 * 1024 * 1024;  // 5 MB

  if ($file['error'] !== UPLOAD_ERR_OK) {
    $errors[] = 'Upload failed';
  } elseif (!in_array($file['type'], $allowed, true)) {
    $errors[] = 'Only JPEG, PNG, and WebP allowed';
  } elseif ($file['size'] > $maxBytes) {
    $errors[] = 'File too large (max 5 MB)';
  } else {
    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = bin2hex(random_bytes(16)) . '.' . $ext;
    move_uploaded_file($file['tmp_name'], "uploads/$filename");
  }
}
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| `echo $_GET['name']` directly | XSS — user can inject HTML/scripts | Always `htmlspecialchars()` |
| No method check (`REQUEST_METHOD`) | GET request tries to process empty form | Check `if ($_SERVER['REQUEST_METHOD'] === 'POST')` |
| No redirect after POST | Browser refresh resubmits the form | `header('Location: ...')` + `exit` on success |
| Trusting `$_FILES['type']` | Attacker can fake the MIME type | Also check the file extension and optionally file contents |

---

## Checkpoint

- [ ] You can read `$_GET` and `$_POST` safely with `?? ''`
- [ ] You can validate required fields, emails, and numeric ranges
- [ ] You always `htmlspecialchars()` before echoing user input
- [ ] You implement the Post-Redirect-Get pattern

---

**Next lesson:** [08 — Connecting to MySQL with PDO](./08-pdo-mysql)
