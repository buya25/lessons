---
sidebar_position: 7
---

# 06 — Arrays

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** create and manipulate indexed and associative arrays, and use PHP's array functions to transform data.

---

## The Hook

When you fetch 50 products from the database, PHP gives you an array.  
Every form with multiple checkboxes sends an array.  
Every JSON response you receive is an array.

Arrays are the workhorse of PHP.

---

## Two Kinds of Arrays

**Indexed array** — ordered by integer keys (0, 1, 2, …):
```php
$fruits = ['apple', 'banana', 'cherry'];
echo $fruits[0];   // apple
echo $fruits[2];   // cherry
```

**Associative array** — keyed by strings:
```php
$user = [
  'name'  => 'Alice',
  'email' => 'alice@example.com',
  'age'   => 25,
];
echo $user['name'];   // Alice
```

PHP uses the same `array` type for both. An associative array is not a separate "object" — it's just an array with string keys.

---

## Creating and Modifying

```php
// Add to end
$fruits[] = 'date';          // appends 'date'
array_push($fruits, 'elderberry');  // same thing

// Add with key
$user['role'] = 'admin';

// Remove
unset($fruits[1]);           // removes 'banana' — gap remains
$fruits = array_values($fruits);  // re-indexes: 0, 1, 2, ...

// Check if key exists
isset($user['email'])        // true
array_key_exists('email', $user)  // true (even if value is null)
```

---

## Common Array Functions

**Searching:**
```php
in_array('apple', $fruits)      // true — value exists
array_search('apple', $fruits)  // 0   — returns the key
```

**Slicing and splicing:**
```php
array_slice($fruits, 1, 2)       // elements at index 1 and 2
array_splice($fruits, 1, 1, ['mango'])  // replace 1 element at index 1
```

**Sorting:**
```php
sort($fruits)          // sort indexed array by value (modifies in place)
rsort($fruits)         // sort descending
asort($user)           // sort associative by value, keep keys
ksort($user)           // sort by key
usort($products, fn($a, $b) => $a['price'] <=> $b['price'])  // custom sort
```

**Transforming:**
```php
$names = array_map(fn($u) => $u['name'], $users)  // extract one field
$active = array_filter($users, fn($u) => $u['active'])  // keep matching
$total = array_reduce($items, fn($carry, $item) => $carry + $item['price'], 0)
```

**Combining:**
```php
$merged = array_merge($arr1, $arr2)    // numeric keys re-indexed
$unique = array_unique($fruits)        // remove duplicates
$keys   = array_keys($user)            // ['name', 'email', 'age']
$values = array_values($user)          // ['Alice', 'alice@...', 25]
```

---

## Multidimensional Arrays

Arrays can contain arrays — this is how database results look:

```php
$products = [
  ['id' => 1, 'name' => 'Notebook',  'price' => 150],
  ['id' => 2, 'name' => 'Pen',       'price' => 15],
  ['id' => 3, 'name' => 'Backpack',  'price' => 800],
];

foreach ($products as $product) {
  echo $product['name'] . ': KES ' . $product['price'] . "\n";
}

// Access nested:
echo $products[0]['name'];  // Notebook
```

---

## Destructuring

PHP 7.1+ allows array unpacking:

```php
$point = [10, 20];
[$x, $y] = $point;
echo $x;  // 10

// Named (associative):
$user = ['name' => 'Alice', 'email' => 'alice@example.com'];
['name' => $name, 'email' => $email] = $user;
echo $name;  // Alice

// In foreach:
foreach ($products as ['id' => $id, 'name' => $name]) {
  echo "$id: $name\n";
}
```

---

## Spread Operator

```php
$defaults = ['color' => 'blue', 'size' => 'M', 'quantity' => 1];
$overrides = ['size' => 'L', 'quantity' => 3];

$merged = [...$defaults, ...$overrides];
// ['color' => 'blue', 'size' => 'L', 'quantity' => 3]
```

Later keys overwrite earlier ones.

---

## Fill in the Blank

Given this array of orders, fill in the blank to get only orders with `status === 'paid'`:

```php
$orders = [
  ['id' => 1, 'status' => 'paid',    'total' => 500],
  ['id' => 2, 'status' => 'pending', 'total' => 200],
  ['id' => 3, 'status' => 'paid',    'total' => 750],
];

$paid = array_filter($orders, fn($order) => ____);
```

<details>
<summary>Answer</summary>

```php
$paid = array_filter($orders, fn($order) => $order['status'] === 'paid');
```

`array_filter` keeps elements where the callback returns `true`. The result still has the original keys (0 and 2) — use `array_values($paid)` if you need 0, 1, 2 indexing.

</details>

---

## Predict Before You Run

```php
<?php
$a = ['x' => 1];
$b = ['x' => 2, 'y' => 3];
$c = array_merge($a, $b);
echo $c['x'];
echo count($c);
```

<details>
<summary>Answer</summary>

```
2
2
```

`array_merge` with string keys: the second array's value for `'x'` overwrites the first. Result: `['x' => 2, 'y' => 3]`. `count` returns `2`.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `unset($arr[1])` then using indexes | Gaps in the array — `[0, 2, 3]` | Follow with `array_values()` to re-index |
| `in_array($val, $arr)` without strict | `0 == "anything"` in loose comparison | Use `in_array($val, $arr, true)` for strict |
| `array_merge` with numeric keys | Re-indexes everything from 0 | Use `+` operator to preserve keys: `$a + $b` |
| Modifying array inside `foreach` | Doesn't affect original | Iterate with `&$item` or use array functions |

---

## Checkpoint

- [ ] You can create indexed and associative arrays
- [ ] You can use `array_map`, `array_filter`, and `array_reduce`
- [ ] You can destructure arrays in assignments and `foreach`
- [ ] You know the difference between `array_merge` key behaviour

---

**Next lesson:** [07 — Forms and User Input](./07-forms-and-user-input)
