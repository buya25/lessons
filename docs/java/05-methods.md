---
sidebar_position: 6
---

# 05 — Methods

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** define methods with parameters and return types, overload methods, and use `static` vs instance methods.

---

## The Hook

A Java program without methods would put every line of code in `main`.  
Methods name and encapsulate behaviour so you can read, reuse, and test it.

---

## Defining a Method

```java
public class Calculator {

    // Return type | Name | Parameters
    public int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(3, 4));  // 7
    }
}
```

Parts of a method signature:
- `public` — visibility
- `int` — return type (use `void` when nothing is returned)
- `add` — method name
- `(int a, int b)` — parameters with their types

---

## void Methods

```java
public void greet(String name) {
    System.out.println("Hello, " + name + "!");
    // no return statement needed
}
```

`void` means the method doesn't return a value.

---

## Multiple Return Paths

```java
public String classify(int score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "F";
}
```

Java requires that every code path returns a value (or throws). The compiler will tell you if you forget one.

---

## Method Overloading

Java allows multiple methods with the same name if the parameter types differ:

```java
public class Formatter {

    public String format(int n) {
        return String.valueOf(n);
    }

    public String format(double n) {
        return String.format("%.2f", n);
    }

    public String format(double n, String prefix) {
        return prefix + " " + String.format("%.2f", n);
    }
}

Formatter f = new Formatter();
f.format(42);             // "42"
f.format(19.99);          // "19.99"
f.format(19.99, "KES");   // "KES 19.99"
```

Java picks the right method based on the argument types at compile time.

---

## static Methods

A `static` method belongs to the class, not to any instance — you don't need to create an object to call it:

```java
public class MathUtils {
    public static int square(int n) {
        return n * n;
    }

    public static boolean isEven(int n) {
        return n % 2 == 0;
    }
}

// Call without creating an object:
int result = MathUtils.square(5);     // 25
boolean even = MathUtils.isEven(4);   // true
```

Use `static` for utility/helper methods that don't need instance state.

---

## Parameters Are Passed by Value

Java always passes by value — the method gets a copy of the value:

```java
public void double(int n) {
    n = n * 2;  // modifies the copy, not the original
}

int x = 5;
double(x);
System.out.println(x);  // still 5
```

For objects, the **reference** is copied — the method can modify the object's fields, but can't replace the reference:

```java
public void changeName(Person p) {
    p.name = "Bob";  // modifies the object — original is affected
}
```

---

## Varargs

Accept a variable number of arguments:

```java
public int sum(int... numbers) {
    int total = 0;
    for (int n : numbers) {
        total += n;
    }
    return total;
}

sum(1, 2, 3);         // 6
sum(1, 2, 3, 4, 5);   // 15
sum();                // 0
```

`int... numbers` — `numbers` is treated as an `int[]` inside the method.

---

## Fill in the Blank

Complete the method so it returns `true` if a string is a palindrome (reads the same forwards and backwards):

```java
public static boolean isPalindrome(String s) {
    String reversed = new StringBuilder(s).______().______();
    return s.______(reversed);
}
```

<details>
<summary>Answer</summary>

```java
public static boolean isPalindrome(String s) {
    String reversed = new StringBuilder(s).reverse().toString();
    return s.equals(reversed);
}
```

`StringBuilder.reverse()` reverses the character sequence. `.toString()` converts it back to a String. `.equals()` compares string content (not references).

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `void` method with `return value;` | Compile error | Change return type or remove the value |
| Forgetting `static` on a utility method | Can only call on an instance | Add `static` if no instance state is needed |
| Overloading with same types in different order | Compile error — ambiguous | Different types, not just different order |
| Returning `int` but declaring `void` | Compile error | Match return type to what you actually return |

---

## Checkpoint

- [ ] You can write a method with typed parameters and a return type
- [ ] You know when to use `static` vs instance methods
- [ ] You understand that primitives are passed by value
- [ ] You can overload a method name for different parameter types

---

**Next lesson:** [06 — Classes and Objects](./06-classes-objects)
