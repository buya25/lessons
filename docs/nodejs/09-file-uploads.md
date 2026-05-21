---
sidebar_position: 10
---

# 09 — File Uploads

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** accept file uploads, validate file types and sizes, and save files to disk.

---

## The Hook

Products need photos. User profiles need avatars.  
File uploads are one of the first features beginners avoid — this lesson makes them straightforward.

---

## Install Multer

Multer is the standard Node.js middleware for handling file uploads:

```bash
npm install multer
```

---

## Basic Upload Setup

```javascript
import multer from 'multer'
import path   from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))  // where to save
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))  // unique filename
  },
})
```

---

## File Validation

```javascript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB   = 5

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)   // accept
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'))
    }
  },
})
```

---

## Upload Route

```javascript
import fs from 'fs'

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// Single file upload
router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const fileUrl = `/uploads/${req.file.filename}`
  res.json({ url: fileUrl, filename: req.file.filename })
})

// Multiple files
router.post('/upload-many', authenticate, upload.array('images', 5), (req, res) => {
  const urls = req.files.map(f => `/uploads/${f.filename}`)
  res.json({ urls })
})
```

---

## Serve the Uploads Folder

```javascript
// In index.js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
```

Now `http://localhost:3000/uploads/filename.jpg` serves the file.

---

## Handle Multer Errors

Multer errors need special handling because they occur inside middleware:

```javascript
router.post('/upload', authenticate, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: `File too large. Max ${MAX_SIZE_MB}MB` })
      }
      return res.status(400).json({ error: err.message })
    }
    if (err) return res.status(400).json({ error: err.message })

    if (!req.file) return res.status(400).json({ error: 'No file provided' })

    res.json({ url: `/uploads/${req.file.filename}` })
  })
})
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| No file type validation | Users upload `.exe` or `.php` files | Always validate `mimetype` |
| Trusting `file.originalname` | Path traversal attacks | Generate a new unique filename always |
| No size limit | Server storage exhausted | Always set `limits.fileSize` |
| Serving uploads without auth | Private files exposed | Only serve public images without auth |

---

## Checkpoint

- [ ] Multer configured with disk storage and unique filenames
- [ ] File type and size validated before saving
- [ ] Upload endpoint returns the file URL
- [ ] Uploaded files accessible via `/uploads/filename`
- [ ] Multer errors handled and return clear messages

---

**Next lesson:** [10 — WebSockets with Socket.io](./10-websockets-socketio)
