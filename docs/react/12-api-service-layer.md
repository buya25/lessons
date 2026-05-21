---
sidebar_position: 13
---

# 12 — API Service Layer

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** centralise all API calls in a service layer so components stay clean and the API URL is never scattered across files.

---

## The Hook

Right now your API URL `http://localhost:5000` is scattered across every component that fetches data.  
Change the URL once and you have to find every file that uses it.

A **service layer** puts all API logic in one place. Components call functions — they never know the URL.

---

## Axios Instance — One Base URL

Create `src/services/api.js`:

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## Product Service

Create `src/services/productService.js`:

```javascript
import api from './api'

export const productService = {
  getAll(params = {}) {
    return api.get('/products', { params })
  },

  getOne(id) {
    return api.get(`/products/${id}`)
  },

  create(data) {
    return api.post('/products', data)
  },

  update(id, data) {
    return api.put(`/products/${id}`, data)
  },

  delete(id) {
    return api.delete(`/products/${id}`)
  },
}
```

---

## Auth Service

Create `src/services/authService.js`:

```javascript
import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data  // { token }
  },

  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
  },
}
```

---

## Order Service

Create `src/services/orderService.js`:

```javascript
import api from './api'

export const orderService = {
  getMyOrders() {
    return api.get('/orders')
  },

  getOne(id) {
    return api.get(`/orders/${id}`)
  },

  placeOrder(shippingAddress, items) {
    return api.post('/orders', {
      shipping_address: shippingAddress,
      items,
    })
  },
}
```

---

## Using Services in Components

Components now look like this:

```jsx
import { productService } from '../services/productService'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    productService.getAll()
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [])

  // ...
}
```

No URLs. No axios imports in components. Clean.

---

## Environment Variables

The API URL should not be hardcoded for production. Use Vite's env system:

Create `.env` at the root of your React project:
```
VITE_API_URL=http://localhost:5000/api
```

Update `api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
```

Vite exposes env vars starting with `VITE_` to your code.  
In production you set `VITE_API_URL` to the real deployed URL.

Add `.env` to `.gitignore`.

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| API URL hardcoded in components | Must update dozens of files for prod | Centralise in `api.js` |
| No 401 interceptor | Users stay on broken pages when token expires | Handle 401 globally in the interceptor |
| Using `process.env.X` in Vite | `undefined` — Vite uses `import.meta.env` | Use `import.meta.env.VITE_X` |

---

## Checkpoint

- [ ] `api.js` created with base URL and JWT interceptor
- [ ] `productService`, `authService`, `orderService` created
- [ ] Components use services — no raw `axios` calls in components
- [ ] API URL loaded from `.env` via `import.meta.env.VITE_API_URL`

---

**Next lesson:** [13 — Authentication Flow](./13-authentication-flow)
