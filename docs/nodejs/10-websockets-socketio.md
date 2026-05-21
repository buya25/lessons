---
sidebar_position: 11
---

# 10 — WebSockets with Socket.io

**Estimated time:** ~20 minutes  
**After this lesson, you will be able to:** set up Socket.io, create rooms, and send real-time messages between the server and all connected clients.

---

## The Hook

HTTP is one-directional — the client asks, the server answers. Then the connection closes.

**WebSockets** keep the connection open. Both sides can send messages at any time.  
This is how chat apps, live notifications, collaborative tools, and real-time dashboards work.

**Socket.io** wraps WebSockets with rooms, reconnection, and fallbacks built in.

---

## Install

```bash
npm install socket.io
```

For the client (React app):
```bash
npm install socket.io-client
```

---

## Server Setup

Socket.io attaches to an HTTP server, not directly to Express:

```javascript
import express    from 'express'
import { createServer } from 'http'
import { Server }  from 'socket.io'
import cors        from 'cors'

const app    = express()
const server = createServer(app)           // wrap Express with http.Server
const io     = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
})

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(3000, () => console.log('Server on port 3000'))
```

Note: `server.listen()` not `app.listen()` — the HTTP server wraps both Express and Socket.io.

---

## Chat Rooms

```javascript
io.on('connection', (socket) => {
  // User joins a room
  socket.on('join_room', ({ roomId, username }) => {
    socket.join(roomId)
    socket.data.username = username
    socket.data.roomId   = roomId

    // Notify everyone in the room
    io.to(roomId).emit('user_joined', {
      username,
      message: `${username} joined the room`,
    })

    console.log(`${username} joined room ${roomId}`)
  })

  // User sends a message
  socket.on('send_message', ({ roomId, message }) => {
    const chatMessage = {
      id:        Date.now(),
      username:  socket.data.username,
      message,
      timestamp: new Date().toISOString(),
    }

    // Broadcast to everyone in the room (including sender)
    io.to(roomId).emit('receive_message', chatMessage)
  })

  // User leaves
  socket.on('leave_room', ({ roomId }) => {
    socket.leave(roomId)
    io.to(roomId).emit('user_left', {
      username: socket.data.username,
      message:  `${socket.data.username} left the room`,
    })
  })

  socket.on('disconnect', () => {
    if (socket.data.roomId) {
      io.to(socket.data.roomId).emit('user_left', {
        username: socket.data.username,
        message:  `${socket.data.username} disconnected`,
      })
    }
  })
})
```

---

## Emitting — Who Receives the Event

| Method | Who receives it |
|--------|----------------|
| `socket.emit('event', data)` | Only this one client |
| `io.to(room).emit('event', data)` | Everyone in the room |
| `socket.to(room).emit('event', data)` | Everyone in the room except the sender |
| `io.emit('event', data)` | Everyone connected to the server |

---

## React Client

```javascript
// src/services/socket.js
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')
export default socket
```

```jsx
// In a Chat component
import { useEffect, useState } from 'react'
import socket from '../services/socket'

export default function ChatRoom({ roomId, username }) {
  const [messages, setMessages] = useState([])
  const [input,    setInput]    = useState('')

  useEffect(() => {
    socket.emit('join_room', { roomId, username })

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.emit('leave_room', { roomId })
      socket.off('receive_message')
    }
  }, [roomId])

  function sendMessage() {
    if (!input.trim()) return
    socket.emit('send_message', { roomId, message: input })
    setInput('')
  }

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}
```

---

## Persist Messages to Database

```javascript
socket.on('send_message', async ({ roomId, message }) => {
  const chatMessage = {
    id:        Date.now(),
    username:  socket.data.username,
    user_id:   socket.data.userId,
    message,
    timestamp: new Date().toISOString(),
  }

  // Save to database
  await query(
    'INSERT INTO messages (room_id, user_id, content) VALUES (?, ?, ?)',
    [roomId, socket.data.userId, message]
  )

  io.to(roomId).emit('receive_message', chatMessage)
})
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| `app.listen()` instead of `server.listen()` | Socket.io never starts | Use the `http.Server` instance |
| Not removing listeners on unmount | Memory leak + duplicate messages | Call `socket.off('event')` in useEffect cleanup |
| Broadcasting with `io.emit()` when you need a room | Messages go to everyone | Use `io.to(roomId).emit()` |

---

## Checkpoint

- [ ] Socket.io server attached to the HTTP server
- [ ] Users can join and leave rooms
- [ ] Messages broadcast to the correct room only
- [ ] React client connects, joins a room, and receives messages live
- [ ] Messages saved to the database

---

**Next lesson:** [11 — Rate Limiting and Security](./11-rate-limiting-and-security)
