# StreamVault — React Frontend

A complete, production-grade React frontend for the **chai-backend** MERN stack video hosting platform. Built with Vite, React 18, Tailwind CSS, and Zustand.

---

## ✨ Features

### Pages & Functionality
- 🏠 **Home Feed** — Browse and filter videos with sort options
- 🎬 **Video Watch Page** — Full-featured player with likes, subscribe, comments
- 💬 **Comment System** — Add, edit, delete comments with like support
- 📺 **Channel Profile** — Avatar, cover image, subscriber count, video/tweet tabs
- 🔍 **Search** — Real-time video search
- 📤 **Upload Videos** — Drag-drop zone with thumbnail preview
- 📊 **Dashboard** — Channel stats, video management, publish toggle
- 🐦 **Community Feed** — Create, edit, delete tweets/posts with likes
- ❤️ **Liked Videos** — View all liked content
- 📚 **Playlists** — Create, view, delete playlists
- 🕒 **Watch History** — Full viewing history
- ⚙️ **Settings** — Edit profile, update avatar, change password
- 🔐 **Auth** — Login & register with JWT + auto token refresh

### Technical Highlights
- ⚡ **Vite + React 18** — Lightning fast development
- 🎨 **Tailwind CSS** — Dark, professional design system
- 🐻 **Zustand** — Lightweight global state with persistence
- 🔄 **Axios Interceptors** — Auto token refresh on 401
- 📜 **React Hook Form** — Efficient form handling with validation
- 🍞 **React Hot Toast** — Clean notifications
- 🗂️ **File Uploads** — Multipart form data for video/image uploads
- 📱 **Fully Responsive** — Mobile sidebar, adaptive grid layouts
- 💀 **Skeleton Loaders** — Smooth loading states
- 🗑️ **Confirm Dialogs** — Safe destructive action confirmation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Your chai-backend running on `http://localhost:8000`

### Installation

```bash
# 1. Navigate to the frontend directory
cd videostream-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app runs at **http://localhost:5173** and proxies all `/api` calls to your backend at `http://localhost:8000`.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute
│   ├── comment/       # CommentSection, CommentItem
│   ├── common/        # Avatar, Spinner, EmptyState, Skeletons, ConfirmDialog
│   ├── layout/        # Layout, Navbar, Sidebar
│   ├── tweet/         # TweetCard
│   └── video/         # VideoCard, VideoGrid, VideoPlayer
├── hooks/             # useFetch, useToggle, useInfiniteScroll, useDebounce
├── pages/             # All route-level page components
├── services/          # api.js (axios instance) + all service functions
├── store/             # Zustand auth store
└── utils/             # Format helpers (time, views, duration)
```

---

## 🔌 Backend API Endpoints Used

| Feature | Endpoints |
|---|---|
| Auth | `/users/register`, `/users/login`, `/users/logout`, `/users/refresh-token`, `/users/current-user`, `/users/update-account`, `/users/change-password`, `/users/avatar`, `/users/cover-image`, `/users/c/:username`, `/users/history` |
| Videos | `/videos`, `/videos/:videoId`, `/videos/toggle/publish/:videoId` |
| Tweets | `/tweets`, `/tweets/user/:userId`, `/tweets/:tweetId` |
| Subscriptions | `/subscriptions/c/:channelId`, `/subscriptions/u/:subscriberId` |
| Likes | `/likes/toggle/v/:videoId`, `/likes/toggle/c/:commentId`, `/likes/toggle/t/:tweetId`, `/likes/videos` |
| Comments | `/comments/:videoId`, `/comments/c/:commentId` |
| Playlists | `/playlist`, `/playlist/:playlistId`, `/playlist/user/:userId`, `/playlist/add/:videoId/:playlistId`, `/playlist/remove/:videoId/:playlistId` |
| Dashboard | `/dashboard/stats`, `/dashboard/videos` |

---

## 🎨 Design System

The UI uses a **dark professional** theme with:
- **Colors:** `dark-900` background (#0a0a0b), `brand-500` accent (orange #f97316)
- **Fonts:** Bebas Neue (display headings) + DM Sans (body text)
- **Animations:** Fade in, slide up, slide in left transitions throughout
- **Components:** Cards, badges, skeleton loaders, confirm dialogs, empty states

---

## 📝 Environment

The Vite dev proxy handles CORS. For production, update `vite.config.js` proxy target to your deployed backend URL, or set the `VITE_API_URL` environment variable and update `src/services/api.js`.

```env
# .env (optional, for production)
VITE_API_BASE_URL=https://your-backend.com/api/v1
```

---

## 🔧 Customization

- **Brand name:** Change "StreamVault" in `Navbar.jsx`, `Sidebar.jsx`, `index.html`
- **Colors:** Edit `tailwind.config.js` → `colors.brand`
- **API base URL:** Edit `src/services/api.js` → `baseURL`
- **Backend port:** Edit `vite.config.js` → proxy target
