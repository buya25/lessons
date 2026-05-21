---
sidebar_position: 13
---

# 12 — Validation and Error Handling

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** validate request data with annotations, return structured error responses, and handle exceptions globally.

---

## The Hook

Without validation, a `POST /api/products` with `{"name": "", "price": -50}` would save garbage to the database.  
Spring Validation rejects invalid requests before they reach your service.

---

## Adding Validation Dependency

Already included if you selected "Validation" at start.spring.io. Otherwise add to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

## Validating a Request DTO

```java
// src/main/java/com/inventory/dto/ProductRequest.java
package com.inventory.dto;

import jakarta.validation.constraints.*;

public record ProductRequest(
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must be 255 characters or fewer")
    String name,

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be >= 0")
    Double price,

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be >= 0")
    Integer stock
) {}
```

Common validation annotations:
| Annotation | What it checks |
|-----------|---------------|
| `@NotNull` | Field is not null |
| `@NotBlank` | String is not null, empty, or whitespace |
| `@Size(min, max)` | String or collection size |
| `@Min(n)` / `@Max(n)` | Numeric minimum/maximum |
| `@DecimalMin` / `@DecimalMax` | Decimal number bounds |
| `@Email` | Valid email format |
| `@Pattern(regexp)` | Matches a regex |
| `@Positive` | Number > 0 |
| `@PositiveOrZero` | Number >= 0 |

---

## @Valid in the Controller

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public ProductResponse create(@Valid @RequestBody ProductRequest request) {
    return service.create(request);
}
```

`@Valid` triggers validation. If any constraint fails, Spring throws `MethodArgumentNotValidException` automatically — before your method body even runs.

---

## Global Exception Handler

Instead of putting try/catch in every controller, handle all exceptions in one place:

```java
// src/main/java/com/inventory/exception/GlobalExceptionHandler.java
package com.inventory.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation failures → 400 with field errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest().body(Map.of(
            "status",  400,
            "error",   "Validation Failed",
            "details", errors
        ));
    }

    // 404 — resource not found
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            ProductNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of(
            "status", 404,
            "error",  ex.getMessage()
        ));
    }

    // 409 — conflict (e.g. duplicate name)
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(
            DuplicateResourceException ex) {
        return ResponseEntity.status(409).body(Map.of(
            "status", 409,
            "error",  ex.getMessage()
        ));
    }

    // Catch-all → 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        return ResponseEntity.internalServerError().body(Map.of(
            "status", 500,
            "error",  "Internal server error"
        ));
    }
}
```

Now every exception thrown anywhere in the app is handled consistently.

---

## Custom Exceptions

```java
// NotFoundException
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(int id) {
        super("Product not found with id: " + id);
    }
}

// Conflict
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
```

---

## A Full Controller with Proper Responses

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductResponse> getAll() {
        return service.findAll().stream()
            .map(ProductResponse::from)
            .toList();
    }

    @GetMapping("/{id}")
    public ProductResponse getOne(@PathVariable int id) {
        return ProductResponse.from(service.findById(id));
        // service throws ProductNotFoundException → GlobalExceptionHandler returns 404
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return ProductResponse.from(service.create(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
```

---

## Response DTO with Static Factory

```java
public record ProductResponse(int id, String name, double price, int stock, boolean inStock) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(p.getId(), p.getName(), p.getPrice(), p.getStock(), p.getStock() > 0);
    }
}
```

---

## Predict Before You Run

If you send `POST /api/products` with:
```json
{ "name": "", "price": -10, "stock": 5 }
```

What HTTP status does the response have, and what does the body look like?

<details>
<summary>Answer</summary>

**Status 400 Bad Request**

Body (example):
```json
{
  "status": 400,
  "error": "Validation Failed",
  "details": {
    "name": "Name is required",
    "price": "Price must be >= 0"
  }
}
```

`@NotBlank` fails for `name = ""`. `@DecimalMin(0)` fails for `price = -10`. `stock = 5` is valid.

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Forgetting `@Valid` | Validation annotations ignored | Always add `@Valid` before `@RequestBody` |
| Returning entity directly | Exposes password hashes, internal IDs | Always use a response DTO |
| No `@RestControllerAdvice` | Unhandled exceptions return 500 with HTML | Add a global handler |
| Using `@NotEmpty` on numbers | Annotation doesn't apply to primitives | Use `@NotNull` + `@Min`/`@Max` for numbers |

---

## Checkpoint

- [ ] Request DTO uses `@NotBlank`, `@Min`, `@NotNull` on relevant fields
- [ ] Controller method uses `@Valid` before `@RequestBody`
- [ ] `GlobalExceptionHandler` with `@RestControllerAdvice` handles validation failures and 404s
- [ ] POST returns 201, DELETE returns 204, validation failure returns 400 with field details

---

**Next lesson:** [13 — Security with Spring Security](./13-security)
