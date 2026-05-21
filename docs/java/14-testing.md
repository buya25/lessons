---
sidebar_position: 15
---

# 14 — Testing with JUnit

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** write unit tests with JUnit 5, test Spring Boot controllers with MockMvc, and understand test slices.

---

## The Hook

Spring Boot's auto-configuration makes things "just work" — but it also means bugs can hide in the configuration.  
Tests catch the bugs before your users do.

---

## Dependencies (Already in Spring Boot Starter Test)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

This includes: JUnit 5, Mockito, AssertJ, MockMvc.

---

## Unit Test — Testing a Service

```java
// src/test/java/com/inventory/service/ProductServiceTest.java
package com.inventory.service;

import com.inventory.entity.Product;
import com.inventory.exception.ProductNotFoundException;
import com.inventory.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    ProductRepository repo;

    @InjectMocks
    ProductService service;

    @Test
    void findById_returnsProduct_whenExists() {
        Product product = new Product("Notebook", 150.0, 25);
        when(repo.findById(1)).thenReturn(Optional.of(product));

        Product result = service.findById(1);

        assertThat(result.getName()).isEqualTo("Notebook");
        assertThat(result.getPrice()).isEqualTo(150.0);
        verify(repo).findById(1);
    }

    @Test
    void findById_throwsNotFoundException_whenMissing() {
        when(repo.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99))
            .isInstanceOf(ProductNotFoundException.class)
            .hasMessageContaining("99");
    }
}
```

- `@Mock` — creates a mock (fake) repository
- `@InjectMocks` — creates the service and injects the mock
- `when(...).thenReturn(...)` — defines mock behaviour
- `assertThat(...)` — AssertJ fluent assertions
- `assertThatThrownBy(...)` — asserts an exception is thrown

---

## Integration Test — Testing the Controller

```java
// src/test/java/com/inventory/controller/ProductControllerTest.java
package com.inventory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventory.dto.ProductRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    void getAll_returns200AndArray() throws Exception {
        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void createProduct_returns401_withoutToken() throws Exception {
        String body = objectMapper.writeValueAsString(
            new ProductRequest("Notebook", 150.0, 25)
        );

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void createProduct_returns400_withInvalidData() throws Exception {
        String body = objectMapper.writeValueAsString(
            new ProductRequest("", -10.0, 5)
        );
        String token = getTestToken();

        mockMvc.perform(post("/api/products")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.details.name").value("Name is required"))
            .andExpect(jsonPath("$.details.price").exists());
    }

    private String getTestToken() {
        // Use JwtUtil to generate a test token, or hardcode one for tests
        return "test-token";
    }
}
```

---

## Test Slices — Faster Tests

`@SpringBootTest` loads the entire context (slow). Use slices for focused tests:

```java
// Test only the web layer — no real database
@WebMvcTest(ProductController.class)
class ProductControllerSliceTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean       // replaces the real service with a mock
    ProductService service;

    @Test
    void getOne_returns404_whenNotFound() throws Exception {
        when(service.findById(99)).thenThrow(new ProductNotFoundException(99));

        mockMvc.perform(get("/api/products/99"))
            .andExpect(status().isNotFound());
    }
}
```

`@WebMvcTest` only loads web-related beans. Use `@MockBean` for services and repositories.

---

## JUnit 5 Annotations

```java
@Test          // marks a test method
@BeforeEach    // runs before each test
@AfterEach     // runs after each test
@BeforeAll     // runs once before all tests (must be static)
@AfterAll      // runs once after all tests (must be static)
@Disabled      // skips this test
@DisplayName("Readable test name")
```

```java
@BeforeEach
void setUp() {
    // Create fresh test data before each test
}

@Test
@DisplayName("Should return 404 when product not found")
void productNotFound() {
    // ...
}
```

---

## Running Tests

```bash
mvn test                          # run all tests
mvn test -Dtest=ProductServiceTest  # run one class
```

Or in IntelliJ: right-click any test → Run.

---

## Predict Before You Run

```java
@Test
void testAssertions() {
    List<Integer> numbers = List.of(1, 2, 3, 4, 5);

    assertThat(numbers).hasSize(5);
    assertThat(numbers).contains(3);
    assertThat(numbers).doesNotContain(6);
    assertThat(numbers.get(0)).isEqualTo(2);  // ← this will fail
}
```

Which assertion fails, and with what message?

<details>
<summary>Answer</summary>

The last one — `assertThat(numbers.get(0)).isEqualTo(2)`.  
`numbers.get(0)` is `1`, not `2`.

AssertJ message:
```
expected: 2
but was: 1
```

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Testing with a real database | Slow, fragile, pollutes data | Use `@DataJpaTest` with H2 in-memory DB |
| No `@AutoConfigureMockMvc` on `@SpringBootTest` | MockMvc not injected | Add the annotation |
| `@MockBean` instead of `@Mock` in unit tests | Spring context loaded unnecessarily | `@Mock` for unit tests, `@MockBean` for Spring tests |
| Tests depend on order | Flaky tests | Each test must be independent — reset state in `@BeforeEach` |

---

## Checkpoint

- [ ] At least two unit tests using `@ExtendWith(MockitoExtension.class)` and `@Mock`
- [ ] At least two MockMvc tests checking status codes and response body
- [ ] One test verifies a 404 is returned when a resource is not found
- [ ] One test verifies a 400 is returned for invalid input

---

**Next lesson:** [15 — Project Walkthrough](./15-project-walkthrough)
