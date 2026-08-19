# Vibe Check

Vibe Check is a full-stack web application designed to analyze Reddit subreddits and provide real-time insights. The system consists of a React frontend hosted on GitHub Pages and a Node.js/Express backend API hosted on Render.

## Project Architecture

Frontend: Built with React and Vite, deployed directly to GitHub Pages.
Backend: Node.js and Express API server, hosted on Render.
Communication: Environment-aware REST API routing using Vite build variables.


```

┌───────────────────────┐
│    GitHub Pages       │
│   (React / Vite)      │
└───────────┬───────────┘
│
HTTPS API │ Requests
▼
┌───────────────────────┐
│     Render.com        │
│  (Node.js Backend)    │
└───────────────────────┘

```

## Repository Structure


```

vibe-check/
├── frontend/             # Client-side codebase (React + Vite)
│   ├── src/              # App components and logic
│   ├── vite.config.js    # Vite configuration with base path
│   └── package.json
└── backend/              # Server-side codebase (Express / Node.js)
├── server.js         # API endpoints and entry point
└── package.json

```

## Hosting and Setup Summary

Frontend: React / Vite on GitHub Pages via static site deployment (`gh-pages`).
Backend: Node.js / Express on Render as a web service.

## Live Services and Endpoints

Live Web App: https://princeca799.github.io/vibe-check/
Live API: https://vibe-check-lctu.onrender.com/api/subreddit/delhi

## Environment Configuration

The frontend relies on Vite environment variables to differentiate local development from the production environment hosted on Render.

Frontend Environment Files (`/frontend`)


Vite Base Configuration (`vite.config.js`)

To prevent MIME type and route resolution errors on GitHub Pages, set the base path to match the repository name:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vibe-check/',
})

```

## Local Development Setup

1. Clone the repository:
git clone https://github.com/princeca799/vibe-check.git
cd vibe-check
2. Start the Backend:
cd backend
npm install
npm start
The backend server runs locally at http://localhost:3001.
3. Start the Frontend:
Open a separate terminal:
cd frontend
npm install
npm run dev
The frontend server runs locally at http://localhost:5050.

## Deployment Steps

Backend Deployment (Render)

1. Connect the GitHub repository to Render.
2. Select Web Service.
3. Set Root Directory to `backend`.
4. Set Build Command to `npm install`.
5. Set Start Command to `node server.js`.

Frontend Deployment (GitHub Pages)

1. Navigate to the `frontend/` directory.
2. Ensure `vite.config.js` includes `base: '/vibe-check/'`.
3. Run the build and publish commands:
npm run build
npx gh-pages -d dist

## Notes and Caveats

Render Cold Starts: The backend runs on Render's free tier. If inactive for 15 minutes, the instance spins down. The first request after a idle period takes 30 to 50 seconds to respond.
CORS Configuration: The Express backend allows requests from https://princeca799.github.io.
