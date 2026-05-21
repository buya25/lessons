---
sidebar_position: 6
---

# 05 — Functions

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** define functions, use type hints, write default parameters, and understand variable scope.

---

## The Hook

Without functions, every blog post page would copy-paste the same database code, the same HTML header, and the same authentication check.

Functions let you name a piece of work and reuse it.

---

## Defining a Function

```php
<?php
function greet(string $name): string {
  return "Hello, $name!";
}

echo greet("Alice");   // Hello, Alice!
echo greet("Bob");     // Hello, Bob!
```

- `string $name` — type hint on the parameter (PHP 8)
- `: string` — return type declaration
- `return` sends the value back to the caller

---

## Type Hints

PHP 8 supports full type hints:

```php
function add(int $a, int $b): int {
  return $a + $b;
}

function getUser(int $id): array {
  // ...
}

function maybeNull(int $id): ?string {
  // Returns string or null
  return $id > 0 ? "found" : null;
}

function noReturn(): void {
  echo "I don't return a value";
}
```

Type hints make your code self-documenting and catch errors early.

Enable strict mode at the top of files to make PHP enforce types strictly:
```php
<?php
declare(strict_types=1);
```

Without this, PHP silently converts `"5"` to `5` when you call `add("5", 3)`. With it, PHP throws a `TypeError`.

---

## Default Parameter Values

```php
function paginate(int $page = 1, int $limit = 20): array {
  $offset = ($page - 1) * $limit;
  return ['offset' => $offset, 'limit' => $limit];
}

paginate();        // page 1, limit 20
paginate(3);       // page 3, limit 20
paginate(2, 10);   // page 2, limit 10
```

Default parameters must come after required parameters.

---

## Named Arguments (PHP 8+)

```php
function createUser(string $name, string $email, int $role = 1): void {
  // ...
}

// Named — order doesn't matter, intent is clear
createUser(email: 'alice@example.com', name: 'Alice', role: 2);
```

Named arguments make function calls readable when there are many parameters.

---

## Returning Multiple Values

PHP doesn't support multiple return values directly — return an array:

```php
function divide(int $a, int $b): array {
  if ($b === 0) return ['result' => null, 'error' => 'Division by zero'];
  return ['result' => $a / $b, 'error' => null];
}

['result' => $result, 'error' => $error] = divide(10, 2);
echo $result;  // 5
```

---

## Variable Scope

PHP functions have their own scope — variables outside are NOT available inside:

```php
$message = "Hello";

function printMessage(): void {
  echo $message;  // Error! $message is not defined here
}
```

Pass variables in as parameters:

```php
function printMessage(string $message): void {
  echo $message;  // Works
}

printMessage($message);
```

The `global` keyword can import variables, but avoid it — it creates hidden dependencies:

```php
function printMessage(): void {
  global $message;  // Works, but avoid this pattern
  echo $message;
}
```

---

## Arrow Functions (PHP 7.4+)

Short syntax for simple one-expression functions, often used with `array_map`, `array_filter`:

```php
// Regular function
$double = function(int $n): int { return $n * 2; };

// Arrow function — implicit return, captures outer scope automatically
$double = fn(int $n): int => $n * 2;

$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(fn($n) => $n * 2, $numbers);
// [2, 4, 6, 8, 10]
```

---

## Practical Example — Format a Price

```php
function formatPrice(float $amount, string $currency = 'KES'): string {
  return $currency . ' ' . number_format($amount, 2);
}

echo formatPrice(1234.5);        // KES 1,234.50
echo formatPrice(99.99, 'USD');  // USD 99.99
```

---

## Fill in the Blank

Complete this function that returns `true` if an email is valid, `false` otherwise:

```php
function isValidEmail(string $email): ____ {
  return filter_var($email, ____) !== false;
}
```

<details>
<summary>Answer</summary>

```php
function isValidEmail(string $email): bool {
  return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
```

`filter_var()` with `FILTER_VALIDATE_EMAIL` returns the email if valid, or `false` if not. Comparing to `false` with `!==` (strict) gives a proper `bool`.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Missing `return` | Function returns `null` | Always return a value when the return type is not `void` |
| Accessing outer variables without passing them | Undefined variable error | Pass values as parameters |
| `declare(strict_types=1)` not at line 1 | ParseError | It must be the very first statement in the file |
| No type hints | Type bugs at runtime | Add type hints to all function signatures |

---

## Checkpoint

- [ ] You can write a function with type hints on parameters and return type
- [ ] You know how to use default parameter values
- [ ] You understand that PHP functions have their own scope
- [ ] You can use arrow functions with `array_map`

---

**Next lesson:** [06 — Arrays](./06-arrays)
