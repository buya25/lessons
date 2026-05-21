---
sidebar_position: 2
---

# 01 — What is PHP?

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** explain what PHP does, describe how it fits into a web request, and know where PHP code runs.

---

## The Hook

When you visit a blog, an e-commerce site, or a forum, there is a program running on the server that:
- reads the URL
- queries the database
- builds the HTML
- sends it back to your browser

In millions of websites, that program is written in PHP.  
WordPress, Facebook (early days), Wikipedia, and Laravel are all PHP.

---

## Client-Side vs Server-Side

```
Browser (client)                   Server
─────────────────                  ──────────────────────
HTML    ← you see this             PHP runs here
CSS     ← styles this              reads from MySQL
JavaScript ← runs here             builds the HTML
                                   sends it to you
```

**JavaScript** runs inside your browser — after the page loads.  
**PHP** runs on the server — before the page reaches your browser.

By the time you see the page, PHP has already finished running.

---

## What PHP Does

PHP is most useful for:
- Generating HTML dynamically (different content per user)
- Reading and writing to a database
- Handling form submissions
- Managing login sessions
- Sending emails

PHP is **not** used for:
- Making a page interactive after it loads (that's JavaScript)
- Real-time communication (that's WebSockets)
- Heavy computation (that's Python or C)

---

## How a PHP Request Works

```
1. Browser sends:  GET /posts/5
2. Web server (Apache/Nginx) receives the request
3. Server runs:    post.php (PHP reads post ID 5 from MySQL)
4. PHP outputs:    <html>...<h1>My Post Title</h1>...</html>
5. Browser shows:  the finished HTML page
```

PHP **outputs text**. Whatever PHP `echo`s becomes the HTTP response.

---

## PHP Inside HTML

PHP can be embedded directly in an HTML file:

```php
<!DOCTYPE html>
<html>
<body>
  <h1><?php echo 'Hello from PHP!'; ?></h1>
  <p>Today is: <?php echo date('Y-m-d'); ?></p>
</body>
</html>
```

The `<?php ... ?>` tags mark where PHP code starts and ends. Everything outside is sent to the browser as-is.

Shorthand for echoing a value:
```php
<h1><?= 'Hello from PHP!' ?></h1>
```

`<?=` is short for `<?php echo`.

---

## PHP is Synchronous

Unlike Node.js, PHP is synchronous — each line waits for the previous one to finish:

```php
$user   = getUser($id);    // waits for DB query to finish
$posts  = getPosts($id);   // then this runs
echo buildPage($user, $posts);
```

One request = one PHP process = one thread.  
This is simpler to reason about, but scales differently than async Node.js.

---

## PHP Versions — Use 8.x

PHP 8.1+ is current. Avoid PHP 5 or PHP 7 tutorials — they show old patterns:

| Era | Version | Status |
|-----|---------|--------|
| Old | PHP 5 | Dead — do not use |
| Legacy | PHP 7 | Security-only — avoid |
| Current | PHP 8.x | Use this |

PHP 8 adds: named arguments, match expressions, enums, fibers, and much better type system.

---

## What PHP is NOT

| Myth | Reality |
|------|---------|
| "PHP is dead" | WordPress powers 43% of the web. Laravel is modern and fast |
| "PHP is only for old sites" | PHP 8 + Composer + modern frameworks are competitive |
| "PHP is insecure" | Old PHP habits are insecure. Modern PHP with PDO and proper escaping is not |

---

## Predict Before You Run

```php
<?php
$name = 'World';
echo 'Hello ' . $name . '!';
echo "\n";
echo "Hello $name!";
```

What does this output? Are the two `echo` lines different?

<details>
<summary>Answer</summary>

Both print `Hello World!` followed by a newline. The difference:
- Single quotes `'...'` — no variable interpolation, `$name` is literal text
- Double quotes `"..."` — variables inside are replaced with their values

`echo 'Hello ' . $name . '!'` concatenates with `.`  
`echo "Hello $name!"` interpolates `$name` directly in the string

</details>

---

## Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| `echo '$name'` | Prints the literal `$name` | Use double quotes or concatenation |
| Forgetting `;` at end of line | Parse error | PHP statements end with `;` |
| Mixing HTML and PHP carelessly | Spaghetti code | Separate logic from presentation |
| Using old PHP 5 patterns | Vulnerable, unmaintainable code | Follow PHP 8 practices |

---

## Checkpoint

- [ ] You can explain what PHP does that JavaScript cannot
- [ ] You know where PHP code runs (server, not browser)
- [ ] You can read a basic PHP page with `<?php echo ... ?>` tags
- [ ] You know PHP 8.x is what to use

---

**Next lesson:** [02 — Setup and First Script](./02-setup-and-first-script)
