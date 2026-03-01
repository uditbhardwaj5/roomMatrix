# RoomMatrix

RoomMatrix is an AI-powered floor plan visualizer.
It lets you upload a 2D floor plan image and automatically generate a top-down, photorealistic 3D-style render.

## What this project does

- Upload a floor plan (`.jpg`, `.jpeg`, `.png`) from the home page.
- Save the project metadata and image URLs through a Puter Worker API.
- Generate an AI render from the uploaded floor plan using Puter AI (`txt2img` with input image).
- Compare **Before vs After** using an interactive slider.
- Export the generated image as a PNG.
- Share by copying the hosted image link to clipboard.
- View previous projects in a project grid.

## User flow (simple)

1. Sign in with Puter.
2. Upload a floor plan image.
3. A new project is created and you are redirected to `/visualizer/:id`.
4. If no render exists yet, AI generation starts automatically.
5. You can compare, export, and share the result.

## Tech stack

### Frontend
- React 19 + TypeScript
- React Router v7 (framework mode)
- Vite 7
- Tailwind CSS v4
- `lucide-react` for icons
- `react-compare-slider` for before/after preview

### Platform / backend services
- Puter SDK (`@heyputer/puter.js`) for:
  - Authentication (`puter.auth`)
  - Key-value storage (`puter.kv`)
  - Worker API calls (`puter.workers.exec`)
  - Hosted file storage (`puter.hosting`, `puter.fs`)
  - AI image generation (`puter.ai.txt2img`)

### Runtime / tooling
- Node.js 20+
- npm


## Setup (local development)

### 1) Prerequisites

- Node.js `>=20`
- npm
- A Puter account (for auth, worker, storage, and AI calls)

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create or update `.env.local` in the project root:

```env
VITE_PUTER_WORKER_URL=https://<your-worker-subdomain>.puter.work
```

> This app already uses `VITE_PUTER_WORKER_URL` inside `lib/constants.ts`.

### 4) Run development server

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### 5) Build and run production locally

```bash
npm run build
npm run start
```

## Available scripts

- `npm run dev` — Start local dev server
- `npm run build` — Build app for production
- `npm run start` — Serve built output (`build/server/index.js`)
- `npm run typecheck` — Generate route types and run TypeScript checks

## Notes

- Upload interaction is gated by sign-in state.
- Project save/list/get calls depend on a working Puter Worker URL.
- AI generation uses a strict prompt from `lib/constants.ts` to convert 2D plans into top-down rendered outputs.
