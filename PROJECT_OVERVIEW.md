# iMessage Clone - Project Overview

A real-time chat application built with the MERN stack, featuring Clerk authentication, Socket.io real-time messaging, and HeroUI components.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        iMessage                                 │
├──────────────────────┬──────────────────────────────────────────┤
│       Frontend       │              Backend                     │
│  (React + Vite)      │         (Express + Socket.io)            │
├──────────────────────┼──────────────────────────────────────────┤
│ • HeroUI v2          │ • Clerk Authentication                   │
│ • Zustand (state)    │ • MongoDB + Mongoose                     │
│ • Socket.io-client   │ • Socket.io (real-time)                  │
│ • Tailwind CSS       │ • ImageKit (media uploads)               │
│ • Clerk React        │ • Node-cron (scheduled jobs)             │
└──────────────────────┴──────────────────────────────────────────┘
```

---

## 📦 Technology Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 19.x | UI library |
| **Vite** | 6.x | Build tool & dev server |
| **HeroUI** | 2.x | Component library (modern, accessible) |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Zustand** | 5.x | Lightweight state management |
| **Socket.io-client** | 4.x | Real-time communication |
| **@clerk/clerk-react** | 5.x | Authentication UI components |
| **Axios** | 1.x | HTTP client |
| **Lucide React** | Latest | Icon library |
| **date-fns** | Latest | Date formatting |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| **Express** | 4.x | Web framework |
| **Socket.io** | 4.x | Real-time WebSocket server |
| **Mongoose** | 8.x | MongoDB ODM |
| **@clerk/express** | 1.x | Clerk middleware for Express |
| **@clerk/backend** | 1.x | Clerk webhook verification |
| **ImageKit** | 2.x | Media storage & transformation |
| **node-cron** | 3.x | Scheduled jobs |
| **CORS** | 2.x | Cross-origin resource sharing |
| **dotenv** | 16.x | Environment variables |

---

## 🗂️ Project Structure

```
iMessage/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Authentication UI components
│   │   │   │   ├── AuthActionPanel.jsx
│   │   │   │   ├── AuthCardShell.jsx
│   │   │   │   ├── AuthHeader.jsx
│   │   │   │   └── AuthHeroPanel.jsx
│   │   │   ├── chat/           # Chat UI components
│   │   │   │   ├── AvatarWithOnlineIndicator.jsx
│   │   │   │   ├── ChatComposer.jsx
│   │   │   │   ├── ChatHeader.jsx
│   │   │   │   ├── ChatSidebar.jsx
│   │   │   │   ├── ConversationRow.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageVideo.jsx
│   │   │   │   └── NoConversationPlaceholder.jsx
│   │   │   ├── AppLogo.jsx
│   │   │   ├── PageLoader.jsx
│   │   │   ├── ThemePresetPicker.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── WallpaperPicker.jsx
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── WallpaperContext.jsx
│   │   │   ├── theme.js
│   │   │   └── wallpaper.js
│   │   ├── hooks/
│   │   │   ├── useKeyboardSound.js
│   │   │   ├── useMediaQuery.js
│   │   │   ├── useScrollToBottom.js
│   │   │   └── useSelectedConversation.js
│   │   ├── lib/
│   │   │   ├── axios.js        # Axios instance with interceptors
│   │   │   ├── imagekit.js     # ImageKit client config
│   │   │   └── utils.js        # Utility functions
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx    # Clerk sign-in/up page
│   │   │   └── ChatPage.jsx    # Main chat interface
│   │   ├── store/
│   │   │   ├── useAuthStore.js # Auth state + socket connection
│   │   │   └── useChatStore.js # Chat state + socket events
│   │   ├── styles/
│   │   │   └── hero-ui-theme-presets.css
│   │   ├── data/
│   │   │   ├── herouiThemePresets.js
│   │   │   └── wallpapers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
│
└── backend/
    ├── src/
    │   ├── controllers/
    │   │   ├── auth.controller.js    # Auth check endpoint
    │   │   └── message.controller.js # Message CRUD
    │   ├── lib/
    │   │   ├── cron.js               # Scheduled cleanup job
    │   │   ├── db.js                 # MongoDB connection
    │   │   ├── imagekit.js           # ImageKit server config
    │   │   └── socket.js             # Socket.io server setup
    │   ├── middleware/
    │   │   ├── auth.middleware.js    # Clerk JWT verification
    │   │   └── upload.middleware.js  # Multer for file uploads
    │   ├── models/
    │   │   ├── user.model.js         # User schema
    │   │   └── message.model.js      # Message schema
    │   ├── routes/
    │   │   ├── auth.routes.js        # /api/auth/*
    │   │   └── message.routes.js     # /api/messages/*
    │   ├── seeds/
    │   │   └── user.seed.js          # Demo user seeding
    │   ├── webhooks/
    │   │   └── clerk.webhook.js      # Clerk user sync webhook
    │   └── server.js                 # Express + Socket.io entry
    ├── package.json
    └── .env (not committed)
```

---

## 🔐 Authentication Flow

### Clerk Integration

```
User → Clerk Sign Up/In → Clerk Dashboard
                    ↓
            Clerk Webhook (user.created)
                    ↓
         Backend: /api/webhooks/clerk
                    ↓
         Generate unique userName
                    ↓
         MongoDB: User collection
                    ↓
         Frontend: checkAuth() → Socket connect
```

### Key Files

#### `backend/src/webhooks/clerk.webhook.js`
- **Purpose**: Sync Clerk users to MongoDB
- **Events handled**: `user.created`, `user.updated`, `user.deleted`
- **Key logic**:
  - Verifies webhook signature using `@clerk/backend`
  - Extracts email from `primary_email_address_id`
  - Generates unique `userName` from Clerk username/email/name
  - Ensures uniqueness with numeric suffix (`_1`, `_2`, ...)
  - Upserts user with `{ clerkId, email, fullName, profilePic, userName }`

#### `backend/src/middleware/auth.middleware.js`
- **Function**: `protectRoute(req, res, next)`
- **Purpose**: Verify Clerk JWT and attach MongoDB user to `req.user`
- **Flow**:
  1. Extract `userId` from Clerk token via `getAuth(req)`
  2. Find user in MongoDB by `clerkId`
  3. Return 404 if not synced yet ("User profile is not synced yet")
  4. Attach user to `req.user` and call `next()`

#### `frontend/src/store/useAuthStore.js`
- **State**: `authUser`, `isCheckingAuth`, `onlineUsers`, `socket`
- **Actions**:
  - `checkAuth()`: Calls `/api/auth/check`, connects socket on success
  - `connectSocket(user)`: Creates Socket.io connection with `userId` query
  - `disconnectSocket()`: Cleans up socket connection
  - `clearAuth()`: Resets state and disconnects socket

---

## 💬 Real-time Messaging

### Socket.io Architecture

```
┌─────────────┐     Socket.io       ┌─────────────┐
│  Client A   │ ◄─────────────────► │   Server    │
└─────────────┘                     └─────────────┘
       ▲                                    ▲
       │                                    │
       ▼                                    ▼
┌─────────────┐                     ┌─────────────┐
│  Client B   │ ◄─────────────────► │  MongoDB    │
└─────────────┘                     └─────────────┘
```

#### `backend/src/lib/socket.js`
- **Exports**: `app` (Express), `server` (HTTP + Socket.io)
- **Setup**:
  - CORS: `FRONTEND_URL` with credentials
  - Auth: Extracts `userId` from handshake query
  - Tracks online users in `Map<userId, Set<socketId>>`
- **Events**:
  - `connection`: Register user, emit `getOnlineUsers`
  - `disconnect`: Clean up, emit updated online list
  - `sendMessage`: Save to MongoDB, emit to recipient + sender
  - `getMessages`: Fetch conversation history

#### `frontend/src/store/useChatStore.js`
- **State**: `messages`, `conversations`, `users`, `selectedConversation`
- **Socket listeners**:
  - `getOnlineUsers`: Updates `onlineUsers` array
  - `newMessage`: Adds message to current conversation
- **Actions**:
  - `getUsers()`: Fetch all users for sidebar
  - `getConversations()`: Fetch conversation list
  - `getMessages(conversationId)`: Fetch message history
  - `sendMessage(data)`: Emit `sendMessage` event
  - `subscribeToMessages(id)` / `unsubscribeFromMessages()`: Room management

---

## 🗄️ Database Models

### User Model (`backend/src/models/user.model.js`)

```javascript
{
  clerkId:     { type: String, required: true, unique: true },  // Clerk user ID
  email:       { type: String, required: true, unique: true },  // Primary email
  fullName:    { type: String, required: true },                // Display name
  profilePic:  { type: String, default: "" },                   // Avatar URL
  userName:    { type: String, required: true, unique: true },  // Unique handle
  timestamps:  true                                              // createdAt, updatedAt
}
```

**Indexes**: Unique on `clerkId`, `email`, `userName`

### Message Model (`backend/src/models/message.model.js`)

```javascript
{
  senderId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text:           { type: String },
  image:          { type: String },                              // ImageKit URL
  video:          { type: String },                              // ImageKit URL
  seen:           { type: Boolean, default: false },
  timestamps:   true
}
```

**Indexes**: Compound on `{ senderId, receiverId }` for conversation queries

---

## 🎨 Frontend State & Context

### Theme System (`frontend/src/context/`)
- **ThemeContext**: Provides `theme`, `setTheme`, `resolvedTheme`
- **WallpaperContext**: Provides `wallpaper`, `setWallpaper`, `frameStyle`
- **Persistence**: localStorage for theme/wallpaper preferences
- **Presets**: 8 HeroUI theme presets in `data/herouiThemePresets.js`

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useSelectedConversation` | Manages active conversation, responsive sidebar |
| `useScrollToBottom` | Auto-scroll message list on new messages |
| `useKeyboardSound` | Plays subtle sounds on keystrokes |
| `useMediaQuery` | Responsive breakpoints (mobile/tablet/desktop) |

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| GET | `/check` | `protectRoute` | Verify auth, return MongoDB user |

### Messages (`/api/messages`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/conversations` | List user's conversations |
| GET | `/:conversationId` | Get messages for conversation |
| POST | `/` | Send new message (text/image/video) |
| PUT | `/:messageId/seen` | Mark message as seen |

### Webhooks (`/api/webhooks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/clerk` | Clerk user sync (raw body required) |

---

## 🔧 Key Configuration Files

### Frontend

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite config: React, path aliases (`@` → `src`) |
| `tailwind.config.js` | Tailwind: HeroUI plugin, content paths |
| `eslint.config.js` | ESLint: React, JSX, HeroUI rules |

### Backend

| File | Purpose |
|------|---------|
| `server.js` | Entry: Express + Socket.io, middleware order critical |
| `lib/db.js` | MongoDB connection with error handling |
| `lib/cron.js` | Daily cleanup job (production only) |

---

## 🚀 Environment Variables

### Frontend (`.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (`.env`)
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/imessage
CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
NODE_ENV=development
```

---

## 📝 Important Implementation Details

### Middleware Order (Critical - `server.js`)
```javascript
// 1. Webhook FIRST - needs raw body
app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// 2. JSON parser for regular routes
app.use(express.json());

// 3. CORS
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

// 4. Clerk middleware for JWT parsing
app.use(clerkMiddleware());

// 5. Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
```

### Username Generation Logic (Webhook)
```javascript
// Priority: Clerk username → email prefix → fullName → "user"
let userName = u.username 
  || email?.split("@")[0] 
  || fullName?.toLowerCase().replace(/\s+/g, "_") 
  || "user";

// Ensure uniqueness
while (existingUser && existingUser.clerkId !== u.id) {
  userName = `${baseUserName}_${suffix++}`;
  existingUser = await User.findOne({ userName });
}
```

### Socket Room Pattern
```javascript
// Client joins conversation room
socket.emit("subscribe", conversationId);

// Server broadcasts to room (excluding sender)
socket.to(conversationId).emit("newMessage", message);
```

---

## 🐛 Known Issues & Fixes

### Fixed: Second User Not Syncing to MongoDB
**Problem**: Clerk webhook omitted required `userName` field
**Fix**: Added username generation with uniqueness guarantee in `clerk.webhook.js`

### Middleware Order Matters
Webhook must be registered **before** `express.json()` to receive raw body for signature verification.

---

## 🧪 Testing the Flow

1. **Start backend**: `cd backend && npm run dev`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Sign up first user** → Check Clerk Dashboard + MongoDB
4. **Sign up second user** (email only) → Should now appear in MongoDB with generated username like `john_1`
5. **Open two browsers** → Test real-time messaging

---

## 📚 Additional Resources

- [Clerk Webhooks Docs](https://clerk.com/docs/webhooks)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [HeroUI Components](https://heroui.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

*NOTE FOR ME: Created on 2026-07-07 — Keep this document updated as the project evolves*