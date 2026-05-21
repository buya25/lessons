---
sidebar_position: 11
---

# 10 — Object-Oriented PHP

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** define classes, create objects, use constructors and methods, and understand visibility.

---

## The Hook

So far, functions are loose — they live in files and call each other.  
As your app grows, grouping related data and behaviour into classes makes code easier to find, test, and change.

The `Database` class you saw in lesson 08 is OOP. Laravel, Symfony, and every modern PHP framework are built on classes.

---

## Defining a Class

```php
<?php
declare(strict_types=1);

class Product {
  public int    $id;
  public string $name;
  public float  $price;

  public function __construct(int $id, string $name, float $price) {
    $this->id    = $id;
    $this->name  = $name;
    $this->price = $price;
  }

  public function formattedPrice(): string {
    return 'KES ' . number_format($this->price, 2);
  }

  public function isExpensive(): bool {
    return $this->price > 1000;
  }
}

$product = new Product(1, 'Notebook', 150);
echo $product->name;              // Notebook
echo $product->formattedPrice();  // KES 150.00
echo $product->isExpensive() ? 'yes' : 'no';  // no
```

---

## Visibility

| Keyword | Accessible from |
|---------|----------------|
| `public` | Anywhere — from outside the class, subclasses |
| `protected` | This class and subclasses only |
| `private` | This class only |

```php
class BankAccount {
  private float $balance;  // nobody can set this directly

  public function __construct(float $initial) {
    $this->balance = $initial;
  }

  public function deposit(float $amount): void {
    if ($amount <= 0) throw new InvalidArgumentException('Amount must be positive');
    $this->balance += $amount;
  }

  public function getBalance(): float {
    return $this->balance;
  }
}

$account = new BankAccount(1000);
$account->deposit(500);
echo $account->getBalance();  // 1500
// $account->balance = 9999;  // Fatal error — private
```

---

## Constructor Promotion (PHP 8+)

PHP 8 shorthand — declare and assign properties in one line:

```php
class User {
  // Old way:
  // public int $id;
  // public string $name;
  // public function __construct(int $id, string $name) { ... }

  // PHP 8 promotion:
  public function __construct(
    public readonly int    $id,
    public readonly string $name,
    public readonly string $email,
    public int             $role = 1,
  ) {}
}

$user = new User(1, 'Alice', 'alice@example.com');
echo $user->name;   // Alice
// $user->name = 'Bob';  // Error — readonly
```

`readonly` (PHP 8.1+) means the property can only be set once in the constructor.

---

## Static Methods and Properties

Static members belong to the class, not to instances:

```php
class DB {
  private static ?PDO $instance = null;

  public static function getInstance(): PDO {
    if (self::$instance === null) {
      self::$instance = new PDO(/* ... */);
    }
    return self::$instance;
  }
}

// Use it anywhere without creating an object:
$pdo = DB::getInstance();
```

This is the Singleton pattern — ensures only one PDO connection exists.

---

## Inheritance

```php
class Animal {
  public function __construct(public string $name) {}

  public function speak(): string {
    return "$this->name makes a sound";
  }
}

class Dog extends Animal {
  public function speak(): string {
    return "$this->name barks";
  }

  public function fetch(): string {
    return "$this->name fetches the ball";
  }
}

$dog = new Dog('Rex');
echo $dog->speak();   // Rex barks
echo $dog->fetch();   // Rex fetches the ball
```

`extends` inherits all public and protected members. `speak()` is **overridden** in `Dog`.

---

## Interfaces

Interfaces define what a class must implement, without implementation:

```php
interface Storable {
  public function save(): bool;
  public function delete(): bool;
}

class Post implements Storable {
  public function save(): bool {
    // INSERT or UPDATE to database
    return true;
  }

  public function delete(): bool {
    // DELETE from database
    return true;
  }
}
```

A class can implement multiple interfaces. Use interfaces when you want to guarantee that different classes share the same API.

---

## A Real Model Class

```php
// src/Models/Post.php
<?php
declare(strict_types=1);

class Post {
  public function __construct(
    public readonly int    $id,
    public readonly string $title,
    public readonly string $content,
    public readonly int    $authorId,
    public readonly string $createdAt,
  ) {}

  public static function fromRow(array $row): self {
    return new self(
      id:        $row['id'],
      title:     $row['title'],
      content:   $row['content'],
      authorId:  $row['author_id'],
      createdAt: $row['created_at'],
    );
  }

  public function excerpt(int $length = 150): string {
    return strlen($this->content) > $length
      ? substr($this->content, 0, $length) . '…'
      : $this->content;
  }
}
```

Usage:
```php
$row  = $db->queryOne('SELECT * FROM posts WHERE id = ?', [$id]);
$post = Post::fromRow($row);

echo $post->title;
echo $post->excerpt(100);
```

---

## Fill in the Blank

Complete this class so `$circle->area()` returns the area (π × r²):

```php
class Circle {
  public function __construct(public float $radius) {}

  public function area(): float {
    return ____ * $this->radius ** ____;
  }
}
```

<details>
<summary>Answer</summary>

```php
public function area(): float {
  return M_PI * $this->radius ** 2;
}
```

`M_PI` is PHP's built-in constant for π (3.14159…).

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Forgetting `$this->` inside a method | `Undefined variable` | Always access properties with `$this->property` |
| Using `self::` when you mean `$this->` | Accessing static vs instance | `self::` for static, `$this->` for instance |
| All properties `public` | No encapsulation | Default to `private`/`readonly`, expose via methods |
| God class with 50 methods | Unmaintainable | Split into focused classes |

---

## Checkpoint

- [ ] You can define a class with a constructor, properties, and methods
- [ ] You understand `public`, `protected`, and `private`
- [ ] You can use constructor promotion and `readonly`
- [ ] You can create a static factory method (`fromRow`)

---

**Next lesson:** [11 — Routing and URL Structure](./11-routing)
