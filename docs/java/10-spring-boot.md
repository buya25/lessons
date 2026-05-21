---
sidebar_position: 11
---

# 10 — Spring Boot Basics

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** create REST endpoints with Spring Boot, handle HTTP methods, and read request data.

---

## The Hook

Writing a raw HTTP server in Java is hundreds of lines.  
Spring Boot turns it into this:

```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }
}
```

That's a running HTTP server with a JSON endpoint. Spring Boot handles the server, routing, JSON serialisation, and configuration.

---

## How Spring Boot Works

```
Request → DispatcherServlet → @Controller/@RestController
               → finds @GetMapping/@PostMapping method
               → runs it, serialises return value to JSON
               → sends HTTP response
```

Spring Boot is opinionated — it auto-configures the web server, database connection, and JSON handling based on what's in your `pom.xml`.

---

## Application Entry Point

```java
// src/main/java/com/inventory/ApiApplication.java
package com.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
```

Run it:
```bash
mvn spring-boot:run
```

Spring Boot starts an embedded Tomcat server on port 8080.

---

## @RestController

```java
package com.inventory.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    // GET /api/products
    @GetMapping
    public List<String> getAll() {
        return List.of("Notebook", "Pen", "Backpack");
    }

    // GET /api/products/5
    @GetMapping("/{id}")
    public String getOne(@PathVariable int id) {
        return "Product " + id;
    }
}
```

- `@RestController` = `@Controller` + `@ResponseBody` — automatically serialises return values to JSON
- `@RequestMapping("/api/products")` — base path for all methods in this class
- `@GetMapping` — handles GET requests
- `@PathVariable` — extracts `{id}` from the URL

---

## HTTP Methods

```java
@GetMapping                    // GET /api/products
@GetMapping("/{id}")           // GET /api/products/5
@PostMapping                   // POST /api/products
@PutMapping("/{id}")           // PUT /api/products/5
@PatchMapping("/{id}")         // PATCH /api/products/5
@DeleteMapping("/{id}")        // DELETE /api/products/5
```

---

## Reading Request Data

**Path variable** — from URL segments:
```java
@GetMapping("/{id}")
public Product getOne(@PathVariable int id) { ... }
// GET /api/products/5 → id = 5
```

**Query parameter** — from URL after `?`:
```java
@GetMapping
public List<Product> getAll(
    @RequestParam(defaultValue = "1")  int page,
    @RequestParam(defaultValue = "20") int limit
) { ... }
// GET /api/products?page=2&limit=10
```

**Request body** — JSON in POST/PUT:
```java
@PostMapping
public Product create(@RequestBody ProductRequest request) { ... }
// POST /api/products  body: {"name": "Notebook", "price": 150}
```

---

## Request and Response Objects

```java
// A DTO (Data Transfer Object) for incoming data
public record ProductRequest(String name, double price, int stock) {}

// A DTO for outgoing data
public record ProductResponse(int id, String name, double price, boolean inStock) {}
```

Records are perfect DTOs — immutable, with auto-generated constructors and getters.

---

## ResponseEntity — Control the HTTP Status

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@GetMapping("/{id}")
public ResponseEntity<ProductResponse> getOne(@PathVariable int id) {
    ProductResponse product = service.findById(id);
    if (product == null) {
        return ResponseEntity.notFound().build();  // 404
    }
    return ResponseEntity.ok(product);  // 200
}

@PostMapping
@ResponseStatus(HttpStatus.CREATED)  // returns 201 automatically
public ProductResponse create(@RequestBody ProductRequest request) {
    return service.create(request);
}
```

Common response builders:
```java
ResponseEntity.ok(data)               // 200
ResponseEntity.created(uri).body(data) // 201
ResponseEntity.noContent().build()    // 204
ResponseEntity.badRequest().body(err) // 400
ResponseEntity.notFound().build()     // 404
```

---

## application.properties

Spring Boot configuration lives in `src/main/resources/application.properties`:

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

Use `${ENV_VAR}` to read environment variables or values from `.env` (with dotenv library).

---

## Predict Before You Run

```java
@GetMapping("/{id}")
public String get(@PathVariable String id) {
    return "Getting: " + id;
}
```

What does `GET /api/products/abc123` return?

<details>
<summary>Answer</summary>

`"Getting: abc123"` — Spring maps the URL segment `abc123` to the `id` parameter. The return value is serialised as a JSON string: `"Getting: abc123"`.

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `@Controller` instead of `@RestController` | Returns view name, not JSON | Use `@RestController` for APIs |
| `@PathVariable` name doesn't match `{name}` in URL | Method parameter not bound | Names must match: `/{id}` → `@PathVariable int id` |
| No `@RequestBody` on POST handler | Request body not read | Add `@RequestBody` before the DTO parameter |
| Using entity directly as `@RequestBody` | Exposes all fields, allows partial updates | Create a separate DTO/record |

---

## Checkpoint

- [ ] Spring Boot app starts and responds on port 8080
- [ ] You have at least one `@GetMapping` and one `@PostMapping`
- [ ] You can read `@PathVariable`, `@RequestParam`, and `@RequestBody`
- [ ] POST endpoint returns 201, not 200

---

**Next lesson:** [11 — Spring Data JPA](./11-jpa)
