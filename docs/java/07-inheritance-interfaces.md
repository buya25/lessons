---
sidebar_position: 8
---

# 07 — Inheritance and Interfaces

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** use `extends` for inheritance, `implements` for interfaces, and understand when to use each.

---

## The Hook

Both inheritance and interfaces let different classes share behaviour.  
The difference: inheritance says "is-a" (a Dog **is an** Animal), interfaces say "can-do" (a Dog **can** fetch).

Spring Boot uses interfaces everywhere. Understanding them is not optional.

---

## Inheritance — extends

```java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public String speak() {
        return name + " makes a sound";
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);  // calls Animal's constructor
    }

    @Override
    public String speak() {
        return name + " barks";
    }

    public String fetch() {
        return name + " fetches the ball";
    }
}

Dog dog = new Dog("Rex");
System.out.println(dog.speak());   // Rex barks
System.out.println(dog.fetch());   // Rex fetches the ball

// Polymorphism — Animal reference holds a Dog
Animal a = new Dog("Buddy");
System.out.println(a.speak());     // Buddy barks — calls Dog's speak()
```

- `super(name)` calls the parent constructor
- `@Override` verifies you're actually overriding — the compiler warns if you typo the method name
- A parent reference can hold a child object (polymorphism)

---

## Abstract Classes

An abstract class can have abstract methods — which subclasses must implement:

```java
public abstract class Shape {
    public abstract double area();    // no implementation

    public void print() {
        System.out.println("Area: " + area());
    }
}

public class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

Shape s = new Circle(5.0);
s.print();   // Area: 78.53...
```

You cannot instantiate an abstract class (`new Shape()` is a compile error). It exists only to be extended.

---

## Interfaces — implements

An interface is a pure contract — method signatures, no implementation (mostly):

```java
public interface Persistable {
    void save();
    void delete();
    boolean exists();
}

public class Product implements Persistable {
    @Override
    public void save() {
        // INSERT or UPDATE to database
    }

    @Override
    public void delete() {
        // DELETE from database
    }

    @Override
    public boolean exists() {
        return true;
    }
}
```

A class can implement multiple interfaces:
```java
public class Product implements Persistable, Comparable<Product>, Serializable {
    // ...
}
```

Java only allows extending one class, but implementing many interfaces.

---

## Default Methods in Interfaces (Java 8+)

Interfaces can have default implementations:

```java
public interface Auditable {
    String getCreatedBy();

    default String getAuditSummary() {
        return "Created by: " + getCreatedBy();
    }
}
```

Classes that implement `Auditable` get `getAuditSummary()` for free, but must implement `getCreatedBy()`.

---

## When to Use What

| Use | When |
|-----|------|
| `extends` (inheritance) | Subclass truly **is a** specialised version of the parent |
| `implements` (interface) | Class **can do** something, sharing a contract |
| Abstract class | Partial implementation that subclasses complete |

**Prefer composition over inheritance** — a `Product` that **has a** `PriceCalculator` is often better than a `Product` that **extends** `PriceCalculator`.

---

## instanceof and Pattern Matching (Java 16+)

```java
Animal a = new Dog("Rex");

// Old way:
if (a instanceof Dog) {
    Dog d = (Dog) a;
    d.fetch();
}

// Java 16+ pattern matching:
if (a instanceof Dog d) {
    d.fetch();   // d is already cast
}
```

---

## Predict Before You Run

```java
class A {
    public String method() { return "A"; }
}

class B extends A {
    @Override
    public String method() { return "B"; }
}

A obj = new B();
System.out.println(obj.method());
```

What does this print?

<details>
<summary>Answer</summary>

`B` — the **runtime type** determines which method runs, not the declared type. `obj` is declared as `A`, but the actual object is a `B`. Java always calls the most specific override. This is called **dynamic dispatch**.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Forgetting `super(...)` in child constructor | Compile error if parent has no no-arg constructor | Always call `super(args)` first |
| `@Override` typo | Creates a new method instead of overriding | The compiler catches this with `@Override` |
| Extending multiple classes | Java doesn't allow it | Use interfaces for multiple contracts |
| Calling abstract class constructor with `new` | Compile error | Abstract classes cannot be instantiated |

---

## Checkpoint

- [ ] You can create a subclass with `extends` that overrides a parent method
- [ ] You can define and implement an interface
- [ ] You understand that a parent reference can hold a child object
- [ ] You know the difference between abstract class and interface

---

**Next lesson:** [08 — Collections](./08-collections)
