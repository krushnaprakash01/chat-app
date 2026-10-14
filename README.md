# Chat App 💬

A real-time simulated chat application built with **React 18 + TypeScript + Vite + Tailwind CSS**.

Features multiple chat rooms, simulated peer responses, emoji reactions, typing indicators, and a responsive sidebar — all running entirely in the browser with localStorage persistence.

## ✨ Features

- **Multiple Chat Rooms** — Switch between `#general`, `#tech-talk`, and `#random` channels
- **Simulated Peer Responses** — AI-driven auto-replies with realistic typing indicators
- **Emoji Reactions** — React to any message with emoji toggles
- **User Authentication** — Login screen with customizable username and avatar colors
- **Unread Counts** — Badge notifications for messages in inactive rooms
- **Online User Count** — Simulated fluctuating online presence per room
- **Members Modal** — View online users in the current room
- **Cross-Tab Sync** — Messages synchronize across browser tabs via `StorageEvent`
- **Room Reset** — Restore any room to its default seed state
- **Responsive Design** — Collapsible sidebar, mobile-friendly layout
- **Dark Theme** — Sleek dark UI with `#0a0a0a` background

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling |

## 📂 Folder Structure

```
src/
├── components/
│   ├── ChatHeader.tsx        # Room title, online count, actions
│   ├── Icons.tsx             # SVG icon components
│   ├── LoginScreen.tsx       # Username & avatar selection
│   ├── MessageInput.tsx      # Chat input with send button
│   ├── MessageItem.tsx       # Individual message bubble
│   ├── MessageList.tsx       # Scrollable message feed
│   ├── OnlineUsersModal.tsx  # Online members overlay
│   ├── Sidebar.tsx           # Room list & navigation
│   └── TypingIndicator.tsx   # "User is typing..." animation
├── types/
│   └── chat.ts               # TypeScript interfaces
├── utils/
│   ├── avatars.ts            # Avatar color palette
│   ├── simulation.ts         # Simulated peer reply engine
│   └── storage.ts            # localStorage CRUD helpers
├── App.tsx                   # Root component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## 🌐 Deploy to Vercel

```bash
# Option A: Via Vercel CLI
npx vercel

# Option B: Connect your GitHub repo in the Vercel dashboard
# It auto-detects the Vite framework settings from vercel.json
```

## 📝 How It Works

All data is stored in the browser's **localStorage** — no backend server required. Simulated peer users respond automatically after a short delay, creating a realistic chat experience. Messages, rooms, and user state all persist across page refreshes.

## License

MIT

