---
sidebar_position: 2
---

# 01 — What is Java?

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain what Java is, how the JVM works, and how Java differs from Python, PHP, and JavaScript.

---

## The Hook

Java runs on 3 billion devices — Android phones, bank servers, government systems, and the world's largest e-commerce platforms.

It's not exciting to say that about a language. It's exciting because it means Java jobs exist everywhere, the ecosystem is massive, and code that compiles today still runs in 20 years.

---

## How Java Works — The JVM

Most languages run on one platform — Python scripts run on whatever OS Python is installed on.  
Java runs on the **JVM (Java Virtual Machine)**:

```
Your Code (.java)
       │
       ▼ javac (compiler)
  Bytecode (.class)
       │
       ▼  JVM reads and executes
  Runs on any OS
```

1. You write `.java` source files
2. `javac` compiles them to `.class` bytecode — not machine code, not text
3. The JVM reads bytecode and runs it on any OS

**"Write once, run anywhere"** — the same `.class` file runs on Windows, Linux, and macOS without recompiling.

---

## Java vs JavaScript — Not Related

| | Java | JavaScript |
|-|------|-----------|
| Created by | Sun Microsystems (1995) | Netscape (1995) |
| Runs where | JVM (server, Android) | Browser + Node.js |
| Typed | Static — types declared at compile time | Dynamic — types at runtime |
| Similarity | None — the name was marketing | None |

The names are a coincidence. They are unrelated languages.

---

## Java vs Python

| | Java | Python |
|-|------|--------|
| Types | Static — declared in code | Dynamic — inferred at runtime |
| Speed | Compiled to bytecode — very fast | Interpreted — slower |
| Verbosity | More code to express the same idea | Concise |
| Error detection | Many errors caught at compile time | Errors at runtime |
| Use case | Enterprise, Android, large systems | Data science, scripting, web |

Java's verbosity is a feature in large teams — when you read code, the types tell you what everything is without running it.

---

## Static Typing in Practice

Python:
```python
def add(a, b):
    return a + b

add("hello", 5)  # runs, then crashes at + operator
```

Java:
```java
int add(int a, int b) {
    return a + b;
}

add("hello", 5);  // COMPILE ERROR — won't even start
```

Java catches the error before the program runs. In a large codebase, this matters enormously.

---

## Java Is Everywhere

- **Android apps** — every Android app (before Kotlin took over) was written in Java
- **Spring Boot** — the dominant Java web framework — runs millions of APIs
- **Minecraft** — written in Java
- **Apache Kafka, Elasticsearch, Hadoop** — core internet infrastructure
- **Banking and government** — financial systems often run Java because of its stability and long track record

---

## The Java Ecosystem

| Tool | What it does |
|------|-------------|
| **JDK** | Java Development Kit — compiler + JVM + tools |
| **Maven** | Build tool — manages dependencies, runs tests, packages app |
| **Gradle** | Alternative build tool — faster, more flexible |
| **Spring Boot** | Web framework — REST APIs, auth, database |
| **JPA / Hibernate** | Database ORM — Java objects mapped to database tables |
| **JUnit** | Testing framework |
| **IntelliJ IDEA** | The dominant Java IDE |

---

## A Preview of Java Code

```java
public class HelloWorld {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "!");
    }
}
```

Compared to Python:
```python
name = "World"
print(f"Hello, {name}!")
```

More ceremony in Java — but every line is explicit:
- `public class HelloWorld` — every Java program lives in a class
- `public static void main(String[] args)` — the entry point every Java program needs
- `String name` — the type (`String`) is declared alongside the variable name

---

## What Happens If…

What happens if you write:
```java
int age = "twenty-five";
```

<details>
<summary>Answer</summary>

**Compile error** — Java will refuse to compile the program. `"twenty-five"` is a `String`, not an `int`. You must use the correct type:
```java
int age = 25;
String ageText = "twenty-five";
```

This is Java's core value: the compiler tells you about type mismatches before you ever run the program.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Confusing Java with JavaScript | Wrong job listings, wrong tutorials | They are different languages |
| Expecting Python-like brevity | Frustration | Java requires more code — that's a deliberate design |
| Not installing the JDK | `javac: command not found` | Install the JDK, not just the JRE |

---

## Checkpoint

- [ ] You can explain what the JVM does
- [ ] You know the difference between Java and JavaScript
- [ ] You understand why static typing catches errors before the program runs
- [ ] You know what the JDK is and why you need it

---

**Next lesson:** [02 — Setup and Hello World](./02-setup-hello-world)
