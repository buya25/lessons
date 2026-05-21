---
sidebar_position: 5
---

# 04 — Control Flow

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** use if/else, match, and loops to control what your PHP code does based on conditions and data.

---

## The Hook

A blog shows different content to logged-in users than guests.  
A loop renders one product card per row in a product list.  
An `if` decides whether to show an admin panel.

Control flow is how your program makes decisions.

---

## if / elseif / else

```php
<?php
$age = 20;

if ($age >= 18) {
  echo "Adult";
} elseif ($age >= 13) {
  echo "Teenager";
} else {
  echo "Child";
}
```

Note: PHP uses `elseif` (one word) — though `else if` (two words) also works.

---

## Ternary and Null Coalescing

```php
// Ternary — short if/else for expressions
$label = ($age >= 18) ? "Adult" : "Minor";

// Null coalescing — fallback for null/missing values
$name  = $_GET['name'] ?? 'Guest';
```

---

## match (PHP 8+)

`match` is a cleaner alternative to long `if/elseif` chains:

```php
$status = 'active';

$label = match($status) {
  'active'   => 'Active',
  'inactive' => 'Inactive',
  'banned'   => 'Banned',
  default    => 'Unknown',
};

echo $label;  // Active
```

Key differences from `switch`:
- `match` uses **strict comparison** (`===`) — no type coercion
- Each arm is an **expression** (returns a value), not a block
- No `break` needed — no fall-through
- No `default` throws an `UnhandledMatchError` if nothing matches

---

## switch (Legacy — Know It for Reading Old Code)

```php
switch ($status) {
  case 'active':
    echo 'Active';
    break;        // without break, falls through to next case!
  case 'inactive':
    echo 'Inactive';
    break;
  default:
    echo 'Unknown';
}
```

Prefer `match` in new code. `switch` uses loose comparison — `switch (0)` matches `case "a"` in PHP 7.

---

## for Loop

```php
for ($i = 0; $i < 5; $i++) {
  echo $i . "\n";   // 0, 1, 2, 3, 4
}
```

---

## while Loop

```php
$count = 1;
while ($count <= 3) {
  echo "Count: $count\n";
  $count++;
}
```

---

## foreach — Most Common in PHP

Iterate over arrays (covered in depth in lesson 06):

```php
$fruits = ['apple', 'banana', 'cherry'];

foreach ($fruits as $fruit) {
  echo $fruit . "\n";
}

// With key:
$prices = ['apple' => 1.50, 'banana' => 0.75];

foreach ($prices as $item => $price) {
  echo "$item costs $$price\n";
}
```

`foreach` is what you'll use 90% of the time — looping over database results, form fields, arrays from JSON.

---

## break and continue

```php
for ($i = 0; $i < 10; $i++) {
  if ($i === 5) break;       // stop the loop entirely
  if ($i % 2 === 0) continue; // skip even numbers, go to next iteration
  echo $i . "\n";            // prints: 1, 3
}
```

---

## Combining Control Flow with HTML

PHP is often used to conditionally include HTML:

```php
<?php $isLoggedIn = true; ?>

<?php if ($isLoggedIn): ?>
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/logout">Logout</a>
  </nav>
<?php else: ?>
  <nav>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  </nav>
<?php endif; ?>
```

The `if:` / `endif;` syntax is the preferred form when mixing PHP with HTML — it avoids deeply nested curly braces.

---

## Fill in the Blank

Complete this loop to print the square of each number from 1 to 5:

```php
<?php
for ($i = ____; $i <= ____; ____) {
  echo $i . " squared is " . ____ . "\n";
}
```

<details>
<summary>Answer</summary>

```php
for ($i = 1; $i <= 5; $i++) {
  echo $i . " squared is " . ($i ** 2) . "\n";
}
```

Output:
```
1 squared is 1
2 squared is 4
3 squared is 9
4 squared is 16
5 squared is 25
```

</details>

---

## Predict Before You Run

```php
<?php
$x = 0;

switch ($x) {
  case false:
    echo "false\n";
    break;
  case 0:
    echo "zero\n";
    break;
  case null:
    echo "null\n";
    break;
}
```

Which case runs?

<details>
<summary>Answer</summary>

`"false"` — only the first case, because `switch` uses loose comparison and `0 == false` is `true`. It matches `case false:` first and the `break` stops it there.

This is exactly why `match` is better — it uses strict comparison (`===`) and would not match `false` for `$x = 0`.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `switch` without `break` | Falls through to next case | Always add `break`, or switch to `match` |
| `match` without `default` | Throws `UnhandledMatchError` | Add a `default` arm |
| `if ($x = 5)` instead of `if ($x === 5)` | Assignment instead of comparison — always true | Use `===` |
| `while (true)` without break | Infinite loop | Ensure the loop condition eventually becomes false |

---

## Checkpoint

- [ ] You can write an `if/elseif/else` chain
- [ ] You can use `match` as a clean replacement for `switch`
- [ ] You can write `for` and `foreach` loops
- [ ] You understand the `if:` / `endif;` syntax for mixing PHP and HTML

---

**Next lesson:** [05 — Functions](./05-functions)
