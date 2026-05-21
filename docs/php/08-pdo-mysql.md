---
sidebar_position: 9
---

# 08 — Connecting to MySQL with PDO

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** connect PHP to MySQL using PDO, run queries with prepared statements, and fetch rows as arrays.

---

## The Hook

PHP without a database is just a template engine.  
PDO (PHP Data Objects) is how modern PHP talks to MySQL — safely, with prepared statements that make SQL injection impossible.

---

## Why PDO Over mysqli

| | PDO | mysqli |
|-|-----|--------|
| Works with MySQL, PostgreSQL, SQLite | Yes | MySQL only |
| Prepared statements | Yes | Yes |
| Named placeholders | Yes (`:name`) | No |
| Modern, object-oriented | Yes | Yes |
| Recommendation | Use this | Avoid |

---

## Connecting

```php
<?php
declare(strict_types=1);

$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';
$name = getenv('DB_NAME') ?: 'ecommerce';

try {
  $pdo = new PDO(
    "mysql:host=$host;dbname=$name;charset=utf8mb4",
    $user,
    $pass,
    [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // throw on error
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // arrays not objects
      PDO::ATTR_EMULATE_PREPARES   => false,                    // real prepared statements
    ]
  );
} catch (PDOException $e) {
  error_log('DB connection failed: ' . $e->getMessage());
  http_response_code(500);
  die('Database unavailable');
}
```

Key options:
- `ERRMODE_EXCEPTION` — any query error throws a `PDOException` (you must catch it)
- `FETCH_ASSOC` — rows returned as `['column' => 'value']` arrays
- `EMULATE_PREPARES => false` — tells MySQL to parse the SQL, not PHP — more secure

---

## Prepared Statements — The Only Safe Way

**Never interpolate user input into SQL:**
```php
// NEVER DO THIS — SQL injection
$id  = $_GET['id'];
$sql = "SELECT * FROM products WHERE id = $id";
```

If the user sends `?id=1 OR 1=1`, they get every row in the table.

**Always use prepared statements:**
```php
// Safe — ? is a placeholder, user input is never part of the SQL string
$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
$product = $stmt->fetch();
```

PDO sends the SQL and the data to MySQL separately. The database treats the data as a value, never as SQL code — injection is impossible.

---

## Named Placeholders

More readable for multiple parameters:

```php
$stmt = $pdo->prepare(
  'INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :hash)'
);

$stmt->execute([
  'name'  => $name,
  'email' => $email,
  'hash'  => $hashedPassword,
]);
```

---

## Fetching Rows

```php
// One row
$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
$product = $stmt->fetch();  // associative array or false

if (!$product) {
  http_response_code(404);
  die('Not found');
}

echo $product['name'];

// Multiple rows
$stmt = $pdo->prepare('SELECT * FROM products WHERE category_id = ?');
$stmt->execute([$categoryId]);
$products = $stmt->fetchAll();  // array of arrays

foreach ($products as $product) {
  echo $product['name'] . "\n";
}
```

---

## Last Insert ID

After an `INSERT`, get the auto-incremented ID:

```php
$stmt = $pdo->prepare('INSERT INTO users (name, email) VALUES (?, ?)');
$stmt->execute([$name, $email]);
$newId = (int) $pdo->lastInsertId();
```

---

## A Database Helper

Wrapping PDO in a helper avoids repeating the execute/fetch cycle:

```php
// src/Database.php
<?php
declare(strict_types=1);

class Database {
  private PDO $pdo;

  public function __construct() {
    $this->pdo = new PDO(
      'mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME') . ';charset=utf8mb4',
      getenv('DB_USER'),
      getenv('DB_PASSWORD'),
      [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
      ]
    );
  }

  public function query(string $sql, array $params = []): array {
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
  }

  public function queryOne(string $sql, array $params = []): array|false {
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetch();
  }

  public function execute(string $sql, array $params = []): int {
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->rowCount();
  }

  public function lastInsertId(): int {
    return (int) $this->pdo->lastInsertId();
  }
}
```

Usage:
```php
$db = new Database();

$products = $db->query('SELECT * FROM products WHERE category_id = ?', [$categoryId]);
$product  = $db->queryOne('SELECT * FROM products WHERE id = ?', [$id]);
$db->execute('UPDATE products SET price = ? WHERE id = ?', [$price, $id]);
```

---

## Fill in the Blank

Complete this query to fetch all posts for a given user ID, newest first:

```php
$posts = $db->query(
  'SELECT * FROM posts WHERE user_id = ____ ORDER BY ____ ____',
  [____]
);
```

<details>
<summary>Answer</summary>

```php
$posts = $db->query(
  'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC',
  [$userId]
);
```

</details>

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| String interpolation in SQL | SQL injection | Always use `?` or `:name` placeholders |
| `ERRMODE_SILENT` (default) | Query errors fail silently | Always set `ERRMODE_EXCEPTION` |
| Not checking `fetch()` result | Calling methods on `false` | Check `if (!$row)` after `fetch()` |
| One PDO per query | Slow — new connection every time | Create PDO once, reuse it (singleton or DI) |

---

## Checkpoint

- [ ] PDO connection created with `ERRMODE_EXCEPTION` and `FETCH_ASSOC`
- [ ] All queries use prepared statements with `?` or named placeholders
- [ ] `fetch()` result is checked before use
- [ ] `lastInsertId()` used after INSERT to get the new row's ID

---

**Next lesson:** [09 — Sessions and Cookies](./09-sessions-and-cookies)
