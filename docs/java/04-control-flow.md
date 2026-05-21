---
sidebar_position: 5
---

# 04 — Control Flow

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** use if/else, switch expressions, and loops to control program flow.

---

## The Hook

The logic of any program is: make decisions, repeat operations, handle different cases.  
Java's control flow syntax will feel familiar — most modern languages copied it from C, and Java is in that family.

---

## if / else if / else

```java
int age = 20;

if (age >= 18) {
    System.out.println("Adult");
} else if (age >= 13) {
    System.out.println("Teenager");
} else {
    System.out.println("Child");
}
```

Curly braces are required when there are multiple statements. For single statements they're optional — but always use them:

```java
// Allowed but error-prone:
if (age >= 18)
    System.out.println("Adult");

// Always do this:
if (age >= 18) {
    System.out.println("Adult");
}
```

---

## Ternary Operator

```java
String label = (age >= 18) ? "Adult" : "Minor";
```

---

## switch Expression (Java 14+)

Modern Java `switch` is an expression — it returns a value:

```java
String status = "active";

String label = switch (status) {
    case "active"   -> "Active User";
    case "inactive" -> "Inactive";
    case "banned"   -> "Banned";
    default         -> "Unknown";
};

System.out.println(label);  // Active User
```

The `->` syntax has no fall-through. Each case is one expression. `default` is required if the switch doesn't cover all possible values.

---

## Traditional switch (Legacy — Know It)

```java
switch (status) {
    case "active":
        System.out.println("Active");
        break;           // without break, falls through!
    case "inactive":
        System.out.println("Inactive");
        break;
    default:
        System.out.println("Unknown");
}
```

Prefer the modern `switch` expression. The old form with `break` is a bug magnet.

---

## for Loop

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);   // 0, 1, 2, 3, 4
}
```

Three parts: initialisation; condition; increment — all optional.

---

## Enhanced for (for-each)

For iterating over arrays and collections:

```java
String[] fruits = {"apple", "banana", "cherry"};

for (String fruit : fruits) {
    System.out.println(fruit);
}

// With a List:
List<Integer> numbers = List.of(1, 2, 3, 4, 5);
for (int n : numbers) {
    System.out.println(n);
}
```

---

## while Loop

```java
int count = 0;
while (count < 3) {
    System.out.println(count);
    count++;
}
```

`do-while` runs at least once:

```java
int n;
do {
    n = getInput();  // called at least once
} while (n < 0);
```

---

## break and continue

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) break;       // stop the loop
    if (i % 2 == 0) continue; // skip even numbers
    System.out.println(i);    // 1, 3
}
```

---

## Predict Before You Run

```java
int sum = 0;
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;
    sum += i;
}
System.out.println(sum);
```

What does this print?

<details>
<summary>Answer</summary>

`25` — the sum of odd numbers from 1 to 10: 1 + 3 + 5 + 7 + 9 = 25.

`continue` skips even numbers (`i % 2 == 0`), so only odd values are added to `sum`.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Missing `break` in old `switch` | Fall-through to next case | Add `break`, or use modern `switch` expression |
| `for (int i = 0; i <= arr.length; i++)` | ArrayIndexOutOfBoundsException | `i < arr.length` (strict less-than) |
| Infinite `while` loop | Program hangs | Make sure the condition eventually becomes false |
| `switch` on a `null` value | NullPointerException | Null-check before switching on a reference type |

---

## Checkpoint

- [ ] You can write if/else if/else chains
- [ ] You prefer the modern `switch` expression over the old `switch` statement
- [ ] You can use enhanced for to iterate over arrays and lists
- [ ] You know the difference between `break` and `continue`

---

**Next lesson:** [05 — Methods](./05-methods)
