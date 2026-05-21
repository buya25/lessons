---
sidebar_position: 17
---

# Project — Blog CMS

**Estimated time:** 3–5 hours  
**You will build:** A multi-user blog where anyone can register, logged-in users can write posts and leave comments, and admins can manage all content.

---

## What You Are Building

A complete blog content management system:
- Public: view posts, view comments, register/login
- Authenticated: create posts, edit own posts, comment on posts
- Admin: manage all posts, delete any comment, manage users

All data stored in MySQL. No JavaScript frameworks — PHP generates all HTML.

---

## Database Setup

Add these tables to your `ecommerce` MySQL database (or create a new `blog` database):

```sql
CREATE TABLE IF NOT EXISTS posts (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  content      TEXT NOT NULL,
  author_id    INT NOT NULL,
  published    TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  post_id    INT NOT NULL,
  user_id    INT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INT NOT NULL,
  tag_id  INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
);
```

---

## Pages to Build

### Public pages (no login required)

| Route | What it shows |
|-------|--------------|
| `GET /` | Latest 10 published posts |
| `GET /posts` | All published posts, paginated (10 per page) |
| `GET /posts/:slug` | Single post + comments |
| `GET /login` | Login form |
| `POST /login` | Process login |
| `GET /register` | Register form |
| `POST /register` | Process registration |

### Authenticated pages

| Route | What it shows |
|-------|--------------|
| `GET /dashboard` | User's own posts (published + drafts) |
| `GET /posts/new` | New post form |
| `POST /posts` | Create post |
| `GET /posts/:id/edit` | Edit post form (own posts only) |
| `POST /posts/:id/update` | Update post |
| `POST /posts/:id/delete` | Delete post (own posts only) |
| `POST /posts/:slug/comments` | Add a comment |
| `GET /logout` | Logout and redirect |

### Admin pages

| Route | What it shows |
|-------|--------------|
| `GET /admin/posts` | All posts (published + drafts, all authors) |
| `POST /admin/posts/:id/publish` | Publish or unpublish a post |
| `POST /admin/comments/:id/delete` | Delete any comment |

---

## Requirements

### Posts

- Slugs are generated from the title: "My First Post" → `my-first-post`
- Slugs must be unique — if a duplicate exists, append `-2`, `-3`, etc.
- Posts have a `published` flag — only published posts appear on public pages
- Only the post author (or admin) can edit or delete a post
- A post listing shows: title, author name, date, first 150 characters of content

### Comments

- A comment requires a logged-in user
- Comments display username and relative time ("3 hours ago", "2 days ago")
- The post author and admins can delete any comment on their posts
- CSRF token required on the comment form

### Pagination

- Post listings show 10 per page
- Page navigation: "Previous" / "Next" links with current page in URL (`?page=2`)
- `LIMIT ? OFFSET ?` in the query

### Slug Generation

```php
function createSlug(string $title): string {
  $slug = strtolower($title);
  $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);  // remove special chars
  $slug = preg_replace('/[\s-]+/', '-', $slug);         // spaces to hyphens
  return trim($slug, '-');
}
```

### Relative Time

```php
function relativeTime(string $datetime): string {
  $diff = time() - strtotime($datetime);
  return match(true) {
    $diff < 60      => 'just now',
    $diff < 3600    => (int)($diff / 60)   . ' minutes ago',
    $diff < 86400   => (int)($diff / 3600) . ' hours ago',
    $diff < 604800  => (int)($diff / 86400) . ' days ago',
    default         => date('M j, Y', strtotime($datetime)),
  };
}
```

---

## Constraints

- All SQL uses PDO prepared statements — no string interpolation
- All output uses `h()` (htmlspecialchars) — no raw user data echoed
- Every POST form includes a CSRF token, verified on submission
- Authentication checked with `Auth::require()` before any private page
- Error handler shows friendly pages, logs full details to a file

---

## Stretch Goals

- **Tags** — assign tags to posts, filter post list by tag (`/posts?tag=php`)
- **Draft preview** — authors can preview unpublished posts at `/posts/:id/preview`
- **Markdown** — store content as Markdown, render to HTML using a Composer package
- **Image upload** — post header image, stored in `public/uploads/`
- **Search** — `GET /search?q=keyword` using `LIKE '%keyword%'` with parameterised query
- **RSS feed** — `GET /feed.rss` returning an XML RSS feed of recent posts

---

## Self-Review Checklist

**Security:**
- [ ] Zero SQL queries built with string interpolation
- [ ] Every echoed value goes through `h()`
- [ ] Every POST form has `csrf_token` field, verified in the handler
- [ ] File paths (if any) validated with `basename()` + `realpath()`

**Correctness:**
- [ ] Unpublished posts are not visible to the public
- [ ] Users can only edit/delete their own posts
- [ ] Slugs are unique — tested by creating two posts with the same title
- [ ] Pagination shows correct page numbers and doesn't break on the last page

**Code quality:**
- [ ] No database queries in template files
- [ ] Controllers are thin — logic lives in model/service classes
- [ ] Autoloader used — no `require_once` in routes

---

## How This Connects to Other Tracks

| This project | Connects to |
|-------------|------------|
| `users` table | Same table used in the SQL track's e-commerce schema |
| PDO query patterns | Same as Node.js `mysql2` pool — different syntax, same safety rules |
| Session-based auth | Contrast with JWT auth in the Python and Node.js tracks |
| HTML templates | Once you learn React, you'll see why a frontend framework exists |
