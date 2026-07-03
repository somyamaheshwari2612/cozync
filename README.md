# Cozync ✦

Cozync is a cozy, visual life-logging web app for remembering your days in a way that feels warm, personal, and human.

Instead of treating journaling like a productivity chore, Cozync turns daily moods, tiny wins, notes, and memories into a calm scrapbook you can revisit over time. It is built for people who want to capture their life gently — without pressure, without judgment, and without needing to sign in first.

## ✨ What Cozync does

- Track your days with a calendar-based journal experience
- Log moods, notes, wins, and small moments of progress
- Add stickers and unlock new visual collections as your story grows
- Build streaks and reflect on your consistency over time
- Keep everything local and personal, with a soft, cozy interface

## 🌿 Core features

- Daily entry logging with mood and note support
- Calendar view for browsing past days and memories
- Sticker collection system with unlockable packs
- Streak tracking for journaling and mood logging
- A warm, scrapbook-like UI designed to feel comforting rather than clinical
- Local-first data persistence using IndexedDB via Dexie

## 🛠️ Tech stack

- Framework: Next.js 16
- UI: React 19, TypeScript
- Styling: Tailwind CSS
- Animation: Framer Motion
- State management: Zustand
- Local database: Dexie

## 🚀 Getting started

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## 📦 Project structure

- src/app/ — app routes and main pages
- src/components/ — UI components for the calendar, journal entry experience, stickers, and modals
- src/store/ — Zustand stores for entries, user metadata, and stickers
- src/db/ — database schema and local persistence setup
- src/lib/ — helpers for dates, streaks, and unlock logic

## 🧠 How it works

Cozync stores your entries locally in the browser so you can start journaling immediately. Each day can hold a mood, notes, wins, and stickers, and the app uses those entries to build a visual record of your life over time.

## 🤝 Contributing

Contributions are welcome. If you have ideas for new features, visual improvements, or better journaling flows, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.
