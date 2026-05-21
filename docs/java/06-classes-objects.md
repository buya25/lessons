---
sidebar_position: 7
---

# 06 — Classes and Objects

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** define classes with fields, constructors, and methods, and create objects with `new`.

---

## The Hook

In PHP you had a `Database` class. In Java, **everything** lives in a class — there is no code outside a class.

A class is a blueprint. An object is one instance of that blueprint with its own data.

---

## Defining a Class

```java
package com.inventory;

public class Product {
    // Fields — the data a Product holds
    private int id;
    private String name;
    private double price;
    private int stock;

    // Constructor — runs when you create a new Product
    public Product(int id, String name, double price, int stock) {
        this.id    = id;
        this.name  = name;
        this.price = price;
        this.stock = stock;
    }

    // Getters — read-only access to private fields
    public int    getId()    { return id; }
    public String getName()  { return name; }
    public double getPrice() { return price; }
    public int    getStock() { return stock; }

    // Setter — write access (only for mutable fields)
    public void setPrice(double price) {
        if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
        this.price = price;
    }

    // Business method
    public boolean isInStock() {
        return stock > 0;
    }

    public String summary() {
        return String.format("[%d] %s — %.2f (%d in stock)", id, name, price, stock);
    }
}
```

Creating and using an object:
```java
Product notebook = new Product(1, "Notebook", 150.00, 25);

System.out.println(notebook.getName());     // Notebook
System.out.println(notebook.isInStock());   // true
System.out.println(notebook.summary());     // [1] Notebook — 150.00 (25 in stock)

notebook.setPrice(175.00);
System.out.println(notebook.getPrice());    // 175.0
```

---

## Records — Concise Data Classes (Java 16+)

For simple data containers, Java `record` auto-generates constructor, getters, `equals`, `hashCode`, and `toString`:

```java
public record Product(int id, String name, double price, int stock) {
    // Compact constructor for validation
    public Product {
        if (price < 0) throw new IllegalArgumentException("Price cannot be negative");
        if (stock < 0) throw new IllegalArgumentException("Stock cannot be negative");
    }

    public boolean isInStock() {
        return stock > 0;
    }
}

Product p = new Product(1, "Notebook", 150.0, 25);
System.out.println(p.name());    // Notebook  (getter = field name, not getName)
System.out.println(p.price());   // 150.0
System.out.println(p);           // Product[id=1, name=Notebook, price=150.0, stock=25]
```

Records are **immutable** — their fields cannot be changed after creation. Use them for DTOs (data transfer objects), response objects, and value types.

---

## this — Referring to the Current Object

Inside a method, `this` refers to the object the method was called on:

```java
public void setName(String name) {
    this.name = name;  // this.name = field, name = parameter
}
```

Without `this`, Java would assign the parameter to itself (`name = name` — a no-op).

---

## Constructors

Java provides a default no-argument constructor only if you define none. Once you define any constructor, you must explicitly add a no-arg one if you want it:

```java
public class Product {
    private String name;

    public Product() {}                    // explicit no-arg constructor
    public Product(String name) {          // overloaded constructor
        this.name = name;
    }
    public Product(String name, double price) {
        this(name);                         // calls the constructor above
        this.price = price;
    }
}
```

`this(...)` calls another constructor — useful for delegation.

---

## toString, equals, hashCode

These three methods come from `Object` and should be overridden:

```java
@Override
public String toString() {
    return "Product{id=" + id + ", name='" + name + "'}";
}

@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Product p)) return false;
    return id == p.id;
}

@Override
public int hashCode() {
    return Integer.hashCode(id);
}
```

If you use IntelliJ: `Alt+Insert` → `Generate` → select `toString`, `equals`, `hashCode`.

---

## null — The Billion-Dollar Mistake

Any reference type can be `null` — nothing is there:

```java
String name = null;
System.out.println(name.length());  // NullPointerException — crash
```

Always check before using:
```java
if (name != null) {
    System.out.println(name.length());
}

// Or use the Optional pattern (lesson 08)
```

Java 21+ null checks at runtime are better (helpful NullPointerException messages tell you exactly which variable was null).

---

## Fill in the Blank

Complete the `adjustStock` method so it decreases stock by `quantity` — but throws an exception if there's not enough:

```java
public void adjustStock(int quantity) {
    if (quantity > ____) {
        throw new ____("Not enough stock");
    }
    this.stock ____= quantity;
}
```

<details>
<summary>Answer</summary>

```java
public void adjustStock(int quantity) {
    if (quantity > this.stock) {
        throw new IllegalArgumentException("Not enough stock");
    }
    this.stock -= quantity;
}
```

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `product.name` when `name` is `private` | Compile error | Use `product.getName()` |
| `String s = null; s.length()` | NullPointerException | Null-check first |
| Comparing objects with `==` | Compares references | Use `.equals()` |
| No `@Override` annotation | Typo creates a new method silently | Always add `@Override` when overriding |

---

## Checkpoint

- [ ] You can define a class with private fields, a constructor, and getters
- [ ] You can use Java `record` for simple data classes
- [ ] You understand why `this.name = name` is needed in setters
- [ ] You can override `toString()` and `equals()`

---

**Next lesson:** [07 — Inheritance and Interfaces](./07-inheritance-interfaces)
