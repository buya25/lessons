---
sidebar_position: 3
---

# 02 — Setup and Hello World

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** install the JDK, create a Maven project, write a Java program, and run it.

---

## The Hook

Java setup has a reputation for being complex. It isn't anymore.  
This lesson gets you from nothing to a running program in under 10 minutes.

---

## Install the JDK

You need the **JDK** (Java Development Kit) — not the JRE (Java Runtime Environment). The JRE only runs Java programs; the JDK compiles and runs them.

**Windows:**
```
Download: https://adoptium.net  (Eclipse Temurin — free, community-supported)
Choose: JDK 21 (LTS), Windows x64 installer
Run the installer — it sets PATH automatically
```

**macOS:**
```bash
brew install --cask temurin
```

**Ubuntu / Debian:**
```bash
sudo apt install openjdk-21-jdk
```

Verify:
```bash
java --version
# openjdk 21.x.x ...
javac --version
# javac 21.x.x
```

Both `java` (runs programs) and `javac` (compiles) must work.

---

## Install Maven

Maven is Java's build tool — it downloads dependencies, compiles your code, and packages it.

**Windows:** download from https://maven.apache.org → extract → add `bin/` to PATH  
**macOS:** `brew install maven`  
**Ubuntu:** `sudo apt install maven`

Verify:
```bash
mvn --version
# Apache Maven 3.x.x
```

---

## Create a Maven Project

```bash
mvn archetype:generate \
  -DgroupId=com.lessons \
  -DartifactId=hello \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DarchetypeVersion=1.4 \
  -DinteractiveMode=false
```

This creates:
```
hello/
├── pom.xml                    ← build config (like package.json)
└── src/
    ├── main/
    │   └── java/
    │       └── com/lessons/
    │           └── App.java   ← your code
    └── test/
        └── java/
            └── com/lessons/
                └── AppTest.java
```

---

## Hello World

Open `src/main/java/com/lessons/App.java`:

```java
package com.lessons;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Compile and run:
```bash
cd hello
mvn compile exec:java -Dexec.mainClass="com.lessons.App"
```

Or build a JAR and run it:
```bash
mvn package
java -jar target/hello-1.0-SNAPSHOT.jar
```

---

## Anatomy of a Java Program

```java
package com.lessons;         // namespace — matches folder structure

public class App {           // class name must match filename (App.java)

    public static void main(String[] args) {   // entry point
        System.out.println("Hello, World!");    // print to console
    }
}
```

| Part | Meaning |
|------|---------|
| `package com.lessons` | Where this class lives — like a folder path |
| `public class App` | A public class named `App` |
| `public static void main` | The entry point — Java starts here |
| `String[] args` | Command-line arguments (array of strings) |
| `System.out.println` | Print a line to standard output |

---

## For the Inventory Project — Spring Boot

The lessons use Spring Boot. Create the project at start.spring.io:

```
Project:  Maven
Language: Java
Spring Boot: 3.x (latest stable)
Group: com.inventory
Artifact: api
Dependencies: Spring Web, Spring Data JPA, MySQL Driver, Spring Security, Validation
```

Download and extract. This creates a pre-configured Maven project with all dependencies.

Or use the Spring Boot CLI:
```bash
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,mysql,security,validation \
  -d groupId=com.inventory \
  -d artifactId=api \
  -d javaVersion=21 \
  -o api.zip
unzip api.zip -d api
```

---

## IDE Setup

**IntelliJ IDEA Community** (free) is the best Java IDE:
- Download from https://www.jetbrains.com/idea/download/
- Open the project folder — IntelliJ detects Maven automatically
- Press Ctrl+Shift+F10 to run the current file

**VS Code with Extension Pack for Java** also works:
- Install "Extension Pack for Java" from the marketplace
- Open the folder — VS Code detects Maven and adds run buttons

---

## Predict Before You Run

```java
public class Types {
    public static void main(String[] args) {
        int x = 5;
        double y = 2;
        System.out.println(x / y);
        System.out.println(x / 2);
    }
}
```

What are the two outputs?

<details>
<summary>Answer</summary>

```
2.5
2
```

`x / y`: `x` is `int`, `y` is `double`. Java promotes `int` to `double` → result is `2.5`.  
`x / 2`: both are `int`. Integer division — result is `2`, remainder discarded.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Class name doesn't match filename | `class App` in `Main.java` — compile error | Class name must match filename exactly |
| Missing `public static void main` | No entry point found | Every runnable class needs `main` |
| Installing JRE instead of JDK | `javac: not found` | Install JDK, not JRE |
| Forgetting semicolons | Compile error | Every Java statement ends with `;` |

---

## Checkpoint

- [ ] `java --version` and `javac --version` both return 21.x
- [ ] Maven project created and compiles successfully
- [ ] "Hello, World!" prints when you run the program
- [ ] You understand what `public static void main` is for

---

**Next lesson:** [03 — Variables and Types](./03-variables-and-types)
