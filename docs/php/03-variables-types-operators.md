---
sidebar_position: 4
---

# 03 — Variables, Types, and Operators

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** declare variables, work with PHP's types, use type casting, and manipulate strings.

---

## The Hook

PHP is loosely typed — it will silently convert `"5"` to `5` when you do math, which is both convenient and a source of subtle bugs.

Knowing exactly how PHP handles types prevents an entire class of errors.

---

## Variables

```php
<?php
$name  = 'Alice';          // string
$age   = 25;               // integer
$price = 9.99;             // float
$active = true;            // boolean
$nothing = null;           // null
```

- All variable names start with `$`
- PHP is case-sensitive: `$Name` and `$name` are different variables
- No declaration needed — just assign

---

## Types

| Type | Example | Notes |
|------|---------|-------|
| `string` | `'hello'` | Single or double quotes |
| `int` | `42` | Whole numbers |
| `float` | `3.14` | Decimal numbers |
| `bool` | `true` / `false` | Lowercase in PHP |
| `null` | `null` | No value |
| `array` | `[1, 2, 3]` | Covered in lesson 06 |

Check the type of a variable:
```php
var_dump($age);    // int(25)
var_dump($price);  // float(9.99)
var_dump($name);   // string(5) "Alice"
gettype($age);     // "integer"
```

---

## Type Juggling — PHP's Quirk

PHP converts types automatically when needed:

```php
echo 5 + "3 apples";   // 8  (PHP uses the numeric part of the string)
echo "5" + 3;          // 8  ("5" becomes 5)
echo true + true;      // 2  (true = 1, false = 0)
echo "" == false;      // true (both are "falsy")
echo "0" == false;     // true
echo null == false;    // true
```

This can lead to surprising behaviour. Use **strict comparison** to avoid it:

```php
// == checks value after type conversion (loose)
echo (0 == "a");    // true in PHP 7, false in PHP 8 — changed!
echo (0 == false);  // true

// === checks value AND type (strict)
echo (0 === false);  // false — different types
echo ("5" === 5);    // false — string vs int
echo (5 === 5);      // true

// Always use === for comparisons
```

---

## Type Casting

Convert a value to a specific type:

```php
$str   = "42";
$num   = (int) $str;        // 42
$float = (float) "3.14px";  // 3.14 (stops at non-numeric)
$bool  = (bool) "";         // false
$bool2 = (bool) "false";    // true  (non-empty string!)
$str2  = (string) true;     // "1"
$str3  = (string) false;    // ""
```

Watch out: `(bool) "false"` is `true` — it's a non-empty string. If you need to parse booleans from strings, use an explicit check:
```php
$value = filter_var("false", FILTER_VALIDATE_BOOLEAN);  // false (correct)
$value = filter_var("true",  FILTER_VALIDATE_BOOLEAN);  // true
```

---

## String Operations

**Concatenation:**
```php
$first = "John";
$last  = "Doe";
$full  = $first . " " . $last;   // "John Doe"
$full .= " Jr.";                  // "John Doe Jr."
```

**Interpolation (double quotes only):**
```php
$name = "Alice";
echo "Hello, $name!";            // Hello, Alice!
echo "Hello, {$name}s!";         // Hello, Alices! (curly braces for complex vars)
echo 'Hello, $name!';            // Hello, $name!  (single quotes — no interpolation)
```

**Useful string functions:**
```php
strlen("hello")          // 5 — length
strtoupper("hello")      // "HELLO"
strtolower("HELLO")      // "hello"
trim("  hello  ")        // "hello" — remove whitespace
str_replace("a", "e", "cat")  // "cet"
substr("hello", 1, 3)    // "ell" — start at 1, take 3 chars
strpos("hello", "l")     // 2 — first position of "l"
str_contains("hello", "ell")  // true (PHP 8+)
explode(",", "a,b,c")    // ["a", "b", "c"]
implode(", ", ["a","b"]) // "a, b"
```

---

## Arithmetic Operators

```php
$a = 10;
$b = 3;

echo $a + $b;   // 13
echo $a - $b;   // 7
echo $a * $b;   // 30
echo $a / $b;   // 3.333...
echo $a % $b;   // 1   (remainder)
echo $a ** $b;  // 1000 (exponent — 10 to the power of 3)
echo intdiv($a, $b);  // 3 (integer division)
```

---

## Null Coalescing

```php
// Old way:
$name = isset($_GET['name']) ? $_GET['name'] : 'World';

// PHP 7+:
$name = $_GET['name'] ?? 'World';

// Chained:
$name = $_GET['name'] ?? $_POST['name'] ?? 'World';
```

`??` returns the left side if it exists and is not null, otherwise the right side. Essential for reading form/URL data.

---

## Predict Before You Run

```php
<?php
$a = "10";
$b = 5;
var_dump($a + $b);
var_dump($a . $b);
var_dump($a === $b);
var_dump($a == 10);
```

What are the four outputs?

<details>
<summary>Answer</summary>

```
int(15)     — "10" cast to int, then 10 + 5 = 15
string(3) "105"   — string concatenation, not addition
bool(false)  — "10" (string) !== 10 (int), strict comparison
bool(true)   — "10" == 10, loose comparison converts "10" to int
```

This is why you should use `===` by default.

</details>

---

## Break It

This code has a bug. What is wrong?

```php
<?php
$price = '19.99';
$tax   = 0.15;
$total = $price * (1 + $tax);
echo 'Total: $' . $total;
```

<details>
<summary>What is wrong?</summary>

Nothing functional — PHP will cast `$price` to float automatically. The calculation `19.99 * 1.15 = 22.9885` is correct.

But there are two style issues:
1. `$price` should be stored as a float, not a string, since it's a number
2. The `echo` uses single quotes for the dollar sign, so `$total` would NOT be interpolated — but here it doesn't matter because concatenation is used instead

Try running it. The output is: `Total: $22.9885`

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `==` instead of `===` | Unexpected truthy matches | Default to `===` |
| `(bool) "false"` thinking it's `false` | It's `true` | Use `filter_var()` for boolean strings |
| Forgetting `.` for string concat | Addition instead of concat | Use `.` not `+` for strings |
| Single quotes when you need interpolation | `$name` printed literally | Use double quotes or concatenation |

---

## Checkpoint

- [ ] You can declare variables of each type
- [ ] You know the difference between `==` and `===`
- [ ] You can use `??` to handle missing values
- [ ] You can manipulate strings with `strlen`, `strtolower`, `trim`, `explode`

---

**Next lesson:** [04 — Control Flow](./04-control-flow)
