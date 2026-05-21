---
sidebar_position: 9
---

# 08 — Collections

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** use List, Map, and Set, understand generics, and process collections with streams.

---

## The Hook

Every API response that returns multiple items is a List.  
Every configuration that maps keys to values is a Map.  
Every "unique set of tags" is a Set.

Collections are as central to Java as arrays are to any language.

---

## The Collections Hierarchy

```
Iterable
  └── Collection
        ├── List     ← ordered, allows duplicates
        ├── Set      ← unordered, no duplicates
        └── Queue    ← FIFO queue

Map           ← key-value pairs (not a Collection)
```

Always declare the variable using the interface, not the implementation:
```java
List<String>    list = new ArrayList<>();   // Good
ArrayList<String> list = new ArrayList<>(); // Avoid — locks you to ArrayList
```

---

## List

```java
import java.util.ArrayList;
import java.util.List;

List<String> fruits = new ArrayList<>();
fruits.add("apple");
fruits.add("banana");
fruits.add("cherry");

System.out.println(fruits.get(0));    // apple
System.out.println(fruits.size());    // 3
fruits.remove("banana");
System.out.println(fruits.contains("apple"));  // true

// Iterate:
for (String fruit : fruits) {
    System.out.println(fruit);
}

// Immutable list (Java 9+):
List<String> colours = List.of("red", "green", "blue");
// colours.add("yellow");  — UnsupportedOperationException
```

`LinkedList` — use instead of `ArrayList` when you frequently insert/remove at the beginning.

---

## Map

Key-value pairs, like a dictionary:

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> prices = new HashMap<>();
prices.put("apple",  150);
prices.put("banana", 80);
prices.put("cherry", 200);

System.out.println(prices.get("apple"));    // 150
System.out.println(prices.get("mango"));    // null
System.out.println(prices.getOrDefault("mango", 0));  // 0
System.out.println(prices.containsKey("banana"));     // true
prices.remove("cherry");

// Iterate:
for (Map.Entry<String, Integer> entry : prices.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Immutable map (Java 9+):
Map<String, Integer> config = Map.of("timeout", 30, "retries", 3);
```

`LinkedHashMap` — preserves insertion order.  
`TreeMap` — sorted by key.

---

## Set

No duplicates, no guaranteed order:

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("spring");
tags.add("java");   // ignored — already exists

System.out.println(tags.size());           // 2
System.out.println(tags.contains("java")); // true

// Immutable set:
Set<String> permissions = Set.of("READ", "WRITE");
```

`LinkedHashSet` — preserves insertion order.  
`TreeSet` — sorted.

---

## Generics

`<T>` is a type parameter — you specify the actual type when you use the class:

```java
List<String>         // T = String
List<Integer>        // T = Integer
Map<String, Product> // K = String, V = Product
```

Without generics you'd cast everything from `Object` — dangerous and verbose. Generics let the compiler verify types.

Writing a generic method:
```java
public static <T> List<T> repeat(T item, int times) {
    List<T> result = new ArrayList<>();
    for (int i = 0; i < times; i++) {
        result.add(item);
    }
    return result;
}

List<String> repeated = repeat("hello", 3);  // ["hello", "hello", "hello"]
```

---

## Streams — Processing Collections

Java 8 streams let you process collections with a fluent API:

```java
List<Product> products = // ...

// Filter and collect:
List<Product> expensive = products.stream()
    .filter(p -> p.getPrice() > 100)
    .collect(Collectors.toList());

// Transform (map):
List<String> names = products.stream()
    .map(Product::getName)
    .collect(Collectors.toList());

// Sort:
List<Product> sorted = products.stream()
    .sorted(Comparator.comparing(Product::getPrice))
    .collect(Collectors.toList());

// Find one:
Optional<Product> first = products.stream()
    .filter(p -> p.getName().contains("Notebook"))
    .findFirst();

// Aggregate:
double total = products.stream()
    .mapToDouble(Product::getPrice)
    .sum();

long count = products.stream()
    .filter(Product::isInStock)
    .count();
```

Streams don't modify the original collection — they produce new results.

---

## Optional — No More null Returns

Instead of returning `null` when nothing is found:

```java
public Optional<Product> findById(int id) {
    return products.stream()
        .filter(p -> p.getId() == id)
        .findFirst();
}

// Caller handles both cases explicitly:
Optional<Product> result = findById(5);

result.ifPresent(p -> System.out.println(p.getName()));

String name = result.map(Product::getName).orElse("Unknown");

Product p = result.orElseThrow(() -> new NotFoundException("Product not found"));
```

---

## Fill in the Blank

Complete the stream to return a list of names of products that are in stock, sorted alphabetically:

```java
List<String> inStockNames = products.stream()
    .______(Product::isInStock)
    .______(Product::getName)
    .______(Comparator.naturalOrder())
    .collect(Collectors.toList());
```

<details>
<summary>Answer</summary>

```java
List<String> inStockNames = products.stream()
    .filter(Product::isInStock)
    .map(Product::getName)
    .sorted(Comparator.naturalOrder())
    .collect(Collectors.toList());
```

</details>

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| `list.get(list.size())` | IndexOutOfBoundsException | Last element is at `list.size() - 1` |
| Modifying a list while iterating with for-each | ConcurrentModificationException | Use `removeIf()` or iterate over a copy |
| `List.of()` then calling `add()` | UnsupportedOperationException | `List.of()` is immutable — use `new ArrayList<>(List.of(...))` |
| `map.get(key) + 1` when key missing | NullPointerException | Use `getOrDefault(key, 0) + 1` |

---

## Checkpoint

- [ ] You can use `ArrayList`, `HashMap`, and `HashSet`
- [ ] You understand generics — why `List<String>` not `List`
- [ ] You can use `filter`, `map`, `sorted`, and `collect` on a stream
- [ ] You can return and unwrap `Optional` safely

---

**Next lesson:** [09 — Exceptions](./09-exceptions)
