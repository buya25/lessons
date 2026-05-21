---
sidebar_position: 4
---

# 03 — Variables and Types

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** declare variables with the correct types, understand primitives vs objects, and use Strings.

---

## The Hook

Java makes you declare the type of every variable. This feels like extra work at first.  
After a month, you realise you never wonder what type a variable is — the code tells you.

---

## Primitive Types

Java has 8 primitive types — these are not objects, just raw values:

| Type | Size | Range | Use for |
|------|------|-------|---------|
| `byte` | 8-bit | -128 to 127 | Rarely used directly |
| `short` | 16-bit | -32,768 to 32,767 | Rarely used |
| `int` | 32-bit | -2.1B to 2.1B | Integer numbers |
| `long` | 64-bit | Very large | IDs, timestamps |
| `float` | 32-bit | ~7 decimal digits | Low-precision decimal |
| `double` | 64-bit | ~15 decimal digits | Decimal numbers |
| `char` | 16-bit | Single Unicode char | Characters |
| `boolean` | 1-bit | `true` / `false` | Booleans |

```java
int age        = 25;
long userId    = 1234567890L;   // 'L' suffix required for long literals
double price   = 19.99;
boolean active = true;
char grade     = 'A';           // single quotes for char
```

---

## `var` — Type Inference (Java 10+)

Java can infer the type when you initialise:

```java
var name   = "Alice";    // inferred as String
var age    = 25;         // inferred as int
var price  = 19.99;      // inferred as double
var active = true;       // inferred as boolean
```

`var` only works when the type is obvious from the right-hand side. Use it for local variables — not method parameters or fields.

---

## String

`String` is a class, not a primitive — but it's used so often it feels like one:

```java
String name = "Alice";
String greeting = "Hello, " + name + "!";

// Modern Java: text blocks (Java 15+)
String json = """
    {
        "name": "Alice",
        "age": 25
    }
    """;
```

**Important String methods:**
```java
name.length()              // 5
name.toUpperCase()         // "ALICE"
name.toLowerCase()         // "alice"
name.trim()                // removes leading/trailing whitespace
name.contains("lic")       // true
name.startsWith("Al")      // true
name.replace("Alice", "Bob")  // "Bob"
name.substring(1, 3)       // "li" (start inclusive, end exclusive)
name.split(",")            // split into array
String.format("Hello, %s! You are %d years old.", name, age)
```

**Strings are immutable** — every operation returns a new String:
```java
String s = "hello";
s.toUpperCase();   // does NOT modify s
s = s.toUpperCase();  // this modifies s (reassignment)
```

---

## Wrapper Classes

Each primitive has an object equivalent (wrapper class):

| Primitive | Wrapper |
|-----------|---------|
| `int` | `Integer` |
| `long` | `Long` |
| `double` | `Double` |
| `boolean` | `Boolean` |
| `char` | `Character` |

Wrappers are needed when Java requires objects (collections, generics):

```java
List<Integer> numbers = new ArrayList<>();  // List can't hold int primitives
numbers.add(42);                             // Java autoboxes int to Integer
int n = numbers.get(0);                      // Java unboxes Integer to int
```

Useful static methods on wrappers:
```java
Integer.parseInt("42")       // String → int
Integer.toString(42)         // int → String
Integer.MAX_VALUE            // 2147483647
Double.parseDouble("3.14")   // String → double
```

---

## Constants — `final`

```java
final double PI = 3.14159;
PI = 3;  // Compile error — can't reassign final
```

Constants are declared with `final`. By convention, constant names are `UPPER_SNAKE_CASE`.

---

## Type Casting

```java
double d = 9.99;
int i = (int) d;   // 9 — truncates (does not round)

int x = 65;
char c = (char) x;  // 'A' — ASCII 65

String s = String.valueOf(42);   // int → String
int n = Integer.parseInt("42");  // String → int
```

Widening (small → large type) is automatic. Narrowing (large → small) requires explicit cast and may lose data.

---

## Fill in the Blank

Complete this to print the first and last characters of a string:

```java
String word = "keyboard";
char first = word.______(0);
char last  = word.______(word.______() - 1);
System.out.println(first + " " + last);
```

<details>
<summary>Answer</summary>

```java
char first = word.charAt(0);
char last  = word.charAt(word.length() - 1);
System.out.println(first + " " + last);  // k d
```

`charAt(index)` returns the character at that position. `length()` gives the string length — the last character is at index `length() - 1`.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `long id = 3000000000` | Integer literal overflow | Add `L` suffix: `3000000000L` |
| Comparing strings with `==` | Compares references, not values | Use `equals()`: `name.equals("Alice")` |
| `(int) 9.9` expecting 10 | Cast truncates, doesn't round | Use `Math.round()` to round first |
| Forgetting `String.` prefix on `parseInt` | Can't call on a String literal | `Integer.parseInt("42")` |

---

## Checkpoint

- [ ] You can declare variables with the correct primitive type
- [ ] You know when to use `int` vs `long` vs `double`
- [ ] You can use `String.format()` and common String methods
- [ ] You understand why strings use `.equals()` instead of `==`

---

**Next lesson:** [04 — Control Flow](./04-control-flow)
