---
sidebar_position: 12
---

# 11 — Spring Data JPA

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** map Java classes to database tables with JPA, query data using repositories, and write JPQL for custom queries.

---

## The Hook

Spring Data JPA lets you do this:

```java
Optional<Product> product = productRepository.findById(5);
List<Product> expensive = productRepository.findByPriceGreaterThan(100.0);
```

No SQL. No `ResultSet`. No manual column mapping. Java objects directly from the database.

---

## How JPA Works

```
Java Object (Entity)
      │ @Entity maps to a table
      ▼
JPA / Hibernate
      │ generates SQL, runs it, maps result back to object
      ▼
MySQL
```

JPA is the specification. Hibernate is the most common implementation. Spring Data JPA builds repositories on top.

---

## An Entity

```java
// src/main/java/com/inventory/entity/Product.java
package com.inventory.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }

    // Constructors, getters, setters — or use Lombok (see below)
    protected Product() {}  // required by JPA

    public Product(String name, Double price, Integer stock) {
        this.name  = name;
        this.price = price;
        this.stock = stock;
    }

    public Integer getId()    { return id; }
    public String  getName()  { return name; }
    public Double  getPrice() { return price; }
    public Integer getStock() { return stock; }
    public void setPrice(Double price) { this.price = price; }
    public void setStock(Integer stock) { this.stock = stock; }
}
```

Key annotations:
- `@Entity` — this class maps to a database table
- `@Table(name = "products")` — specifies the table name
- `@Id` — the primary key field
- `@GeneratedValue(IDENTITY)` — uses MySQL's AUTO_INCREMENT
- `@Column` — maps to a column (optional — JPA defaults to the field name)
- `@PrePersist` — runs before INSERT

---

## Lombok — Reduce Boilerplate

Install Lombok to avoid writing getters/setters/constructors manually:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

```java
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String  name;
    private Double  price;
    private Integer stock;
}
```

`@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor` generate the methods at compile time.

---

## Repository

```java
// src/main/java/com/inventory/repository/ProductRepository.java
package com.inventory.repository;

import com.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Spring generates the SQL automatically from the method name:
    List<Product>    findByStockGreaterThan(int minStock);
    List<Product>    findByNameContainingIgnoreCase(String keyword);
    Optional<Product> findByName(String name);
    boolean          existsByName(String name);
}
```

Spring Data JPA reads the method name and generates the correct SQL:
- `findBy` → SELECT WHERE
- `GreaterThan` → `>`
- `Containing` → `LIKE %...%`
- `IgnoreCase` → `LOWER()`
- `And` / `Or` → combine conditions

---

## Using the Repository in a Service

```java
// src/main/java/com/inventory/service/ProductService.java
package com.inventory.service;

import com.inventory.entity.Product;
import com.inventory.exception.ProductNotFoundException;
import com.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;  // constructor injection
    }

    public List<Product> findAll() {
        return repo.findAll();
    }

    public Product findById(int id) {
        return repo.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
    }

    public Product create(Product product) {
        return repo.save(product);
    }

    public Product update(int id, Product updated) {
        Product existing = findById(id);
        existing.setPrice(updated.getPrice());
        existing.setStock(updated.getStock());
        return repo.save(existing);
    }

    public void delete(int id) {
        Product product = findById(id);
        repo.delete(product);
    }
}
```

---

## Custom JPQL Queries

When the method name approach isn't enough:

```java
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    // JPQL (entity names and field names, not table/column names)
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max ORDER BY p.price")
    List<Product> findByPriceRange(@Param("min") double min, @Param("max") double max);

    // Native SQL — same as writing it in MySQL
    @Query(value = "SELECT * FROM products WHERE stock < :threshold LIMIT 10",
           nativeQuery = true)
    List<Product> findLowStock(@Param("threshold") int threshold);
}
```

JPQL uses entity class names and Java field names — Hibernate translates to real SQL.

---

## Relationships

```java
@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}

@Entity
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Product> products;
}
```

- `@ManyToOne` — many products belong to one category
- `@OneToMany` — one category has many products
- `FetchType.LAZY` — don't load products unless explicitly accessed (avoids N+1 queries)

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| No default constructor in entity | JPA can't instantiate | Add `protected Product() {}` |
| `FetchType.EAGER` on collections | Loads entire related table on every query | Default to `LAZY` |
| Returning entity directly from controller | Exposes internal fields, causes serialisation issues | Map to a DTO/record first |
| `ddl-auto=create-drop` in production | Drops and recreates tables on startup | Use `validate` in production |

---

## Checkpoint

- [ ] At least one `@Entity` mapped to a MySQL table
- [ ] `JpaRepository` created with at least 2 derived query methods
- [ ] `@Service` class injected with the repository, exposes CRUD operations
- [ ] Controller uses the service, not the repository directly

---

**Next lesson:** [12 — Validation and Error Handling](./12-validation)
