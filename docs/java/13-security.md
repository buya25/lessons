---
sidebar_position: 14
---

# 13 — Security with Spring Security

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** configure Spring Security, implement JWT authentication, and protect endpoints.

---

## The Hook

Spring Security is powerful but famously hard to configure for the first time.  
This lesson gives you the minimal working setup for JWT-based stateless authentication.

---

## Dependencies

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

---

## JWT Utility

```java
// src/main/java/com/inventory/security/JwtUtil.java
package com.inventory.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import javax.crypto.SecretKey;
import java.util.Base64;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:604800000}")  // 7 days in ms
    private long expirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    }

    public String generate(String email, int userId) {
        return Jwts.builder()
            .subject(email)
            .claim("userId", userId)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(key())
            .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
            .verifyWith(key())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public boolean isValid(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
```

In `application.properties`:
```properties
jwt.secret=BASE64_ENCODED_SECRET_AT_LEAST_32_BYTES
```

Generate a secret:
```bash
openssl rand -base64 32
```

---

## JWT Authentication Filter

```java
// src/main/java/com/inventory/security/JwtFilter.java
package com.inventory.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.isValid(token)) {
                Claims claims = jwtUtil.parse(token);
                var auth = new UsernamePasswordAuthenticationToken(
                    claims.getSubject(),   // email as principal
                    null,
                    List.of()              // no roles yet
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(req, res);
    }
}
```

---

## Security Configuration

```java
// src/main/java/com/inventory/security/SecurityConfig.java
package com.inventory.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())           // stateless API — no CSRF
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()          // public
                .requestMatchers(HttpMethod.GET, "/api/products").permitAll()   // public GET
                .anyRequest().authenticated()                          // everything else needs JWT
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

---

## Auth Controller

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // constructor injection ...

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> register(@Valid @RequestBody RegisterRequest req) {
        if (userService.emailExists(req.email())) {
            throw new DuplicateResourceException("Email already registered");
        }
        User user = userService.create(req.name(), req.email(),
            passwordEncoder.encode(req.password()));
        String token = jwtUtil.generate(user.getEmail(), user.getId());
        return Map.of("token", token, "userId", user.getId(), "name", user.getName());
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest req) {
        User user = userService.findByEmail(req.email())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtUtil.generate(user.getEmail(), user.getId());
        return Map.of("token", token, "userId", user.getId(), "name", user.getName());
    }
}
```

---

## Getting the Current User

```java
import org.springframework.security.core.context.SecurityContextHolder;

public String getCurrentUserEmail() {
    return (String) SecurityContextHolder.getContext()
        .getAuthentication()
        .getPrincipal();
}
```

Or inject as a parameter with `@AuthenticationPrincipal`:
```java
@GetMapping("/me")
public UserResponse me(@AuthenticationPrincipal String email) {
    return UserResponse.from(userService.findByEmail(email).orElseThrow());
}
```

---

## Common Mistakes

| Mistake | Error | Fix |
|---------|-------|-----|
| Enabling CSRF for a stateless API | 403 on all POSTs | Disable CSRF when using JWT |
| Session-based config for JWT | Tokens not respected | `STATELESS` session policy |
| Weak JWT secret | JWT can be forged | At least 256-bit (32-byte) random secret |
| Using `EAGER` user loading in security | N+1 on every request | Load only what you need in the filter |

---

## Checkpoint

- [ ] `JwtUtil` can generate and validate tokens
- [ ] `JwtFilter` extracts the token from the `Authorization` header and sets the authentication
- [ ] `SecurityConfig` permits `/api/auth/**` and public GETs, requires JWT for everything else
- [ ] Passwords hashed with `BCryptPasswordEncoder(12)`

---

**Next lesson:** [14 — Testing with JUnit](./14-testing)
