---
sidebar_position: 16
---

# 15 — Project Walkthrough

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain how all Spring Boot layers connect and build the inventory project in the right order.

---

## The Hook

Fourteen lessons. Classes, JPA, security, validation, tests.  
This lesson maps every piece to its place in the project before you build it.

---

## The Architecture

```
HTTP Request
     │
     ▼
JwtFilter (reads Authorization header, sets SecurityContext)
     │
     ▼
Spring Security (checks if path requires authentication)
     │
     ▼
@RestController (reads request, calls service, returns DTO)
     │
     ▼
@Service (business logic, validation, transactions)
     │
     ▼
JpaRepository (generates SQL, talks to MySQL)
     │
     ▼
MySQL (stores data)
```

---

## The Complete Package Structure

```
src/main/java/com/inventory/
├── ApiApplication.java          ← entry point
├── controller/
│   ├── AuthController.java      ← /api/auth/register, /api/auth/login
│   ├── ProductController.java   ← /api/products CRUD
│   └── SupplierController.java  ← /api/suppliers
├── service/
│   ├── UserService.java
│   ├── ProductService.java
│   └── SupplierService.java
├── repository/
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   └── SupplierRepository.java
├── entity/
│   ├── User.java
│   ├── Product.java
│   └── Supplier.java
├── dto/
│   ├── ProductRequest.java
│   ├── ProductResponse.java
│   ├── RegisterRequest.java
│   └── LoginRequest.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ProductNotFoundException.java
│   └── DuplicateResourceException.java
└── security/
    ├── SecurityConfig.java
    ├── JwtUtil.java
    └── JwtFilter.java
```

---

## Tracing a "Create Product" Request

`POST /api/products` with `Authorization: Bearer <token>` and JSON body:

1. `JwtFilter` reads the `Authorization` header, validates the JWT, sets the user in `SecurityContext`
2. Spring Security checks: `/api/products` POST requires authentication → user is authenticated → proceed
3. `ProductController.create()` runs — `@Valid @RequestBody ProductRequest request`
4. Bean Validation validates the request — `name` not blank, `price >= 0`, `stock >= 0`
5. If validation fails → `MethodArgumentNotValidException` → `GlobalExceptionHandler` → 400
6. If valid → `productService.create(request)` runs
7. Service checks for duplicate name → throws `DuplicateResourceException` → 409 if exists
8. Service creates `Product` entity, calls `repo.save(product)`
9. JPA generates `INSERT INTO products ...` SQL
10. `ProductResponse.from(product)` converts entity to DTO
11. Controller returns 201 with the response body

---

## Layer Rules

| Layer | Can call | Cannot call |
|-------|----------|-------------|
| Controller | Service | Repository, Entity directly |
| Service | Repository, other Services | Controller |
| Repository | JPA (auto) | Service, Controller |
| Entity | Nothing | Service, Repository, Controller |
| DTO | Nothing | Entity, Repository, Controller |

Breaking these rules makes your code harder to test and harder to change.

---

## What to Build First

1. **entities** — `User`, `Product`, `Supplier` mapped to database tables  
2. **repositories** — extend `JpaRepository`, add a few derived methods  
3. **`application.properties`** — database URL, JWT secret  
4. **auth** — `UserService`, `AuthController`, `JwtUtil`, `JwtFilter`, `SecurityConfig`  
5. **product CRUD** — `ProductService`, `ProductController`, DTOs  
6. **validation** — `@NotBlank`, `@Min`, `@Valid` on request DTOs  
7. **exception handling** — `GlobalExceptionHandler`, custom exceptions  
8. **tests** — unit tests for services, MockMvc tests for controllers  

---

## The Request-Response Lifecycle in One Picture

```
[ Client ]
    │  POST /api/products
    │  Authorization: Bearer eyJ...
    │  { "name": "Notebook", "price": 150, "stock": 25 }
    │
    ▼
[ JwtFilter ]
    │  validates token → sets email in SecurityContext
    │
    ▼
[ Spring Security ]
    │  path requires auth → user is authenticated → allow
    │
    ▼
[ ProductController.create() ]
    │  @Valid validates request → name OK, price OK, stock OK
    │
    ▼
[ ProductService.create() ]
    │  no duplicate name → creates Product entity
    │
    ▼
[ ProductRepository.save() ]
    │  Hibernate: INSERT INTO products ...
    │
    ▼
[ MySQL ]
    │  row inserted, id = 42
    │
    ▼
[ ProductService ]
    │  returns saved Product (id now populated)
    │
    ▼
[ ProductController ]
    │  ProductResponse.from(product)
    │
    ▼
[ Client ]
    HTTP 201
    { "id": 42, "name": "Notebook", "price": 150.0, "stock": 25, "inStock": true }
```

---

## Common Integration Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Wrong Spring Security config order | Protected routes return 200 without auth | Check `authorizeHttpRequests` — more specific before `.anyRequest()` |
| JPA entity missing `protected` no-arg constructor | `InstantiationException` | Add `protected Entity() {}` |
| DTO returned from `@SpringBootTest` missing fields | Jackson can't serialise record | Add `@JsonProperty` or check `ObjectMapper` config |
| `@Transactional` missing on multi-step update | Partial update if step 2 fails | Add `@Transactional` to the service method |

---

## Checkpoint

- [ ] You can trace a request from HTTP → filter → controller → service → repository → database
- [ ] You know which layer can call which
- [ ] You know the order to build things in
- [ ] You can explain why DTOs are separate from entities

---

**Next:** [Capstone Project — Inventory API](./project-inventory-api)
