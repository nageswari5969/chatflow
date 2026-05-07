# ChatFlow — Realtime Chat App

A full-stack realtime chat application built with **React + Vite** (frontend) and **Flask + Socket.IO** (backend), using **Clerk** for authentication and **MongoDB** as the database.

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Auth | Clerk (JWT-based, zero password management) |
| Realtime | Socket.IO (client + server) |
| Backend | Flask, Flask-SocketIO, Eventlet |
| Database | MongoDB (via Flask-PyMongo) |
| File Storage | Cloudinary |
| Styling | Pure CSS with CSS variables (dark theme) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB running locally or Atlas URI
- Clerk account → https://clerk.com

---

### 1. Clone & Install

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 2. Configure Environment Variables

**client/.env**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**server/.env**
```
FLASK_ENV=development
SECRET_KEY=change-this-in-production
MONGO_URI=mongodb://localhost:27017/chatflow
CLERK_SECRET_KEY=sk_test_YOUR_KEY
CLERK_JWKS_URL=https://YOUR_CLERK_FRONTEND_API/.well-known/jwks.json
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
FRONTEND_URL=http://localhost:3000
```

> **Where to find Clerk values:**  
> Dashboard → API Keys → `Publishable Key` & `Secret Key`  
> Dashboard → API Keys → `Frontend API URL` (used to build JWKS URL)

---

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd server
source venv/bin/activate
python run.py

# Terminal 2 — Frontend
cd client
npm run dev
```

App runs at **http://localhost:3000**  
API runs at **http://localhost:5000**

---

### 4. Docker (Production)

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
realtime-chat-app/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React contexts (socket, chat, auth)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API calls (axios)
│   │   └── utils/        # Helpers, constants, formatters
│   └── ...
└── server/               # Flask backend
    ├── app/
    │   ├── models/       # MongoDB document helpers
    │   ├── routes/       # REST API blueprints
    │   ├── sockets/      # Socket.IO event handlers
    │   └── utils/        # JWT, decorators, helpers
    └── ...
```

---

## ✨ Features

- 🔐 **Clerk Authentication** — Sign up/in with email, Google, GitHub
- 💬 **Direct Messaging** — 1-on-1 realtime chat
- 👥 **Group Chats** — Create, manage, add/remove members
- 📞 **Voice & Video Calls** — WebRTC signaling via Socket.IO
- ✍️ **Typing Indicators** — Live typing status
- ✅ **Read Receipts** — Message delivery & read status
- 🔔 **Notifications** — Realtime push notifications
- 🟢 **Online Presence** — Live online/offline status
- 😊 **Emoji Picker** — Full emoji support
- 📎 **File Uploads** — Images and files via Cloudinary
- 🛡️ **Admin Panel** — User management, reports, analytics
- 🌙 **Dark Theme** — Beautiful dark UI with CSS variables

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sync` | Sync Clerk user to MongoDB |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/chats` | Get all conversations |
| POST | `/api/chats` | Create conversation |
| GET | `/api/chats/:id/messages` | Get messages |
| POST | `/api/chats/:id/messages` | Send message |
| GET | `/api/groups` | Get user's groups |
| POST | `/api/groups` | Create group |
| GET | `/api/calls` | Call history |
| GET | `/api/notifications` | Get notifications |
| GET | `/api/admin/stats` | Dashboard stats (admin) |

---

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `message:receive` | Server→Client | New message delivered |
| `message:read` | Client→Server | Mark message as read |
| `typing:start` | Client→Server | User started typing |
| `typing:stop` | Client→Server | User stopped typing |
| `user:online` | Server→Client | User came online |
| `user:offline` | Server→Client | User went offline |
| `call:incoming` | Server→Client | Incoming call |
| `call:accept` | Client→Server | Accept call |
| `call:reject` | Client→Server | Reject call |
| `call:signal` | Bidirectional | WebRTC signaling |

---

## 📝 Notes

- After first sign-in via Clerk, the frontend automatically calls `/api/auth/sync` to create the user in MongoDB
- Set `CLERK_JWKS_URL` to `https://<your-frontend-api>/.well-known/jwks.json` (found in Clerk dashboard)
- For production, use MongoDB Atlas and set the URI in your server `.env`
