---
sidebar_position: 10
---

# 09 — Exceptions

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** throw and catch exceptions, understand checked vs unchecked, and create custom exception classes.

---

## The Hook

A database connection fails. A user sends invalid data. A file doesn't exist.  
Exceptions let you handle these cases explicitly — without checking every return value for null.

---

## The Exception Hierarchy

```
Throwable
├── Error         ← JVM-level: OutOfMemoryError, StackOverflowError — don't catch
└── Exception
    ├── RuntimeException (unchecked) ← usually programming bugs
    │   ├── NullPointerException
    │   ├── IllegalArgumentException
    │   ├── IndexOutOfBoundsException
    │   └── IllegalStateException
    └── IOException (checked)        ← must declare or catch
        ├── FileNotFoundException
        └── ...
```

**Checked exceptions** — the compiler forces you to handle them. Used for recoverable conditions outside your control (file not found, network error).

**Unchecked exceptions** (RuntimeException) — optional to catch. Used for programming errors (null access, invalid arguments).

---

## try / catch / finally

```java
try {
    int result = divide(10, 0);
    System.out.println(result);
} catch (ArithmeticException e) {
    System.out.println("Math error: " + e.getMessage());
} catch (IllegalArgumentException e) {
    System.out.println("Bad argument: " + e.getMessage());
} catch (Exception e) {
    System.out.println("Unknown error: " + e.getMessage());
} finally {
    System.out.println("Always runs — close resources here");
}
```

- Catch more specific exceptions before more general ones
- `finally` runs whether or not an exception occurred — good for cleanup
- Catching `Exception` is a last resort — be as specific as possible

---

## Throwing Exceptions

```java
public int divide(int a, int b) {
    if (b == 0) {
        throw new ArithmeticException("Cannot divide by zero");
    }
    return a / b;
}

public void setAge(int age) {
    if (age < 0 || age > 150) {
        throw new IllegalArgumentException("Age must be between 0 and 150, got: " + age);
    }
    this.age = age;
}
```

Always include a descriptive message — it helps with debugging.

---

## Custom Exceptions

```java
// src/main/java/com/inventory/exception/ProductNotFoundException.java
package com.inventory.exception;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(int id) {
        super("Product not found with id: " + id);
    }
}

// src/main/java/com/inventory/exception/InsufficientStockException.java
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String productName, int requested, int available) {
        super(String.format(
            "Insufficient stock for '%s': requested %d, available %d",
            productName, requested, available
        ));
    }
}
```

Using them:
```java
public Product findById(int id) {
    return repository.findById(id)
        .orElseThrow(() -> new ProductNotFoundException(id));
}

public void adjustStock(Product product, int quantity) {
    if (quantity > product.getStock()) {
        throw new InsufficientStockException(product.getName(), quantity, product.getStock());
    }
    product.setStock(product.getStock() - quantity);
}
```

---

## try-with-resources

For anything that implements `AutoCloseable` (files, streams, database connections), use try-with-resources — Java closes it automatically:

```java
// Without try-with-resources — easy to forget close():
FileReader reader = null;
try {
    reader = new FileReader("data.txt");
    // read...
} catch (IOException e) {
    // handle
} finally {
    if (reader != null) reader.close();
}

// With try-with-resources — clean and safe:
try (FileReader reader = new FileReader("data.txt")) {
    // read...
} catch (IOException e) {
    System.out.println("File error: " + e.getMessage());
}
// reader.close() called automatically
```

---

## Checked Exceptions — Declare or Catch

A method that might throw a checked exception must either:
1. Catch it, or
2. Declare it with `throws`:

```java
// Option 1: catch it
public String readFile(String path) {
    try (FileReader r = new FileReader(path)) {
        // read and return
    } catch (IOException e) {
        return "";
    }
}

// Option 2: declare it
public String readFile(String path) throws IOException {
    try (FileReader r = new FileReader(path)) {
        // read and return
    }
}
```

In Spring Boot, most exceptions are unchecked — you rarely need `throws` declarations.

---

## Predict Before You Run

```java
try {
    int[] arr = new int[3];
    arr[5] = 10;
    System.out.println("A");
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("B");
} catch (RuntimeException e) {
    System.out.println("C");
} finally {
    System.out.println("D");
}
System.out.println("E");
```

What is the output?

<details>
<summary>Answer</summary>

```
B
D
E
```

`arr[5]` throws `ArrayIndexOutOfBoundsException`. The first `catch` matches (it's more specific). `"A"` never prints. `finally` always runs. After the try-catch block, `"E"` prints normally.

`"C"` does not print — `RuntimeException` is a superclass of `ArrayIndexOutOfBoundsException`, but the more specific catch comes first and matches.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Empty `catch` block | Exception silently swallowed | Always log or re-throw |
| Catching `Exception` too broadly | Catches things you shouldn't | Catch the most specific type |
| Re-throwing without cause | Stack trace lost | `throw new MyException("msg", e)` — pass original as cause |
| `throw new Exception` instead of specific type | Caller can't distinguish errors | Use or create a specific exception class |

---

## Checkpoint

- [ ] You can throw `IllegalArgumentException` with a descriptive message
- [ ] You can write try/catch/finally and understand when each block runs
- [ ] You've created at least one custom exception class
- [ ] You use try-with-resources for AutoCloseable resources

---

**Next lesson:** [10 — Spring Boot Basics](./10-spring-boot)
