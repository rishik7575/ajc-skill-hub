# AJC Skill Hub

A professional skill development platform with industry-focused internship programs. This repository contains the React (Vite + TypeScript) frontend and an Express + MongoDB API.

## Monorepo Structure

- **/src**: React app (Vite + TS + Tailwind + shadcn/ui)
- **/api**: Express API (auth + password reset)
- **/server**: Legacy/alternative Express API (auth only)
- **/public**: Static assets
- **/image**: Project images

## Tech Stack

- **Frontend**: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, React Router, TanStack Query
- **Backend**: Node.js, Express, Mongoose, JSON Web Tokens, bcryptjs, CORS
- **Tooling**: ESLint, TypeScript, PostCSS, Vite Bundle Analyzer

## Prerequisites

- Node.js 18+ and npm
- MongoDB connection URI

## Environment Variables

Frontend uses Vite `VITE_*` variables. Dev and prod templates are provided:

- `/.env.development` (already present)
- `/.env.production` (template)

Key frontend vars:

- **VITE_API_URL**: Base URL for the API (default dev: `http://localhost:3001`)
- **VITE_WEBSITE_URL**: Public URL of the site (optional for local dev)

Backend (`/api/.env`):

```
PORT=3001
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-secret
```

Note: The legacy `/server` also reads `PORT` and `MONGO_URI`. Prefer `/api` unless you know you need `/server`.

## Quick Start (Development)

1. Install frontend dependencies
   ```sh
   npm install
   ```
2. Install API dependencies
   ```sh
   cd api
   npm install
   ```
3. Configure backend env
   - Create `api/.env` with `PORT`, `MONGO_URI`, and `JWT_SECRET` (see above)
4. Start the API (port 3001)
   ```sh
   npm start --prefix api
   ```
5. Start the frontend (Vite default port 5173)
   ```sh
   npm run dev
   ```
6. Open the app
   - Frontend: http://localhost:5173
   - API: http://localhost:3001

If you need to use the legacy server instead of `/api`:
```sh
npm start --prefix server
```
(Default port is `5000` unless `PORT` is set.)

## Available Scripts (root)

- **dev**: Run Vite dev server
- **build**: Type-check then build for production
- **build:dev**: Build in development mode
- **build:prod**: Full prod build
- **preview**: Preview local build
- **preview:prod**: Build then preview
- **lint**: Run ESLint
- **lint:fix**: ESLint with auto-fix
- **type-check**: TypeScript no-emit type checking
- **analyze**: Build and open bundle analyzer

API scripts:
- `/api`: **start** — runs Express server
- `/server` (legacy): **start** — runs Express server

## API Overview (current routes)

- **Auth** (`/api/auth`)
  - `POST /signup` — email, password, role
  - `POST /login` — email, password → returns JWT and user info
- **Password** (`/api/password`) — only in `/api`
  - `POST /request-reset` — email → issues a 6-digit code (demo returns code in response)
  - `POST /reset` — email, code, newPassword

## Building & Previewing

- Production build
  ```sh
  npm run build
  ```
- Preview the built app locally
  ```sh
  npm run preview
  ```

Ensure frontend `VITE_API_URL` points to your deployed API for production.

## Project Configuration Highlights

- Base URLs (dev defaults):
  - **API**: `http://localhost:3001`
  - **Frontend**: `http://localhost:5173`
- Many app-level settings live in `src/lib/config.ts`

## Troubleshooting

- **MongoDB connection errors**: Verify `MONGO_URI` and network access to your cluster.
- **JWT errors**: Ensure `JWT_SECRET` is set and consistent.
- **CORS issues**: Confirm frontend is pointing to the correct `VITE_API_URL` and that the API `cors()` is enabled (it is by default).
- **Port mismatch**: The frontend expects API at `3001` in development. Set `PORT=3001` in `api/.env`.
- **Vite port**: If `5173` is busy, Vite will offer another port; update any tooling or links if needed.

## Contributing

1. Fork and create a feature branch
2. Run `npm run lint` and `npm run type-check`
3. Open a PR with context and screenshots where applicable

---

Note: A repository metadata file `.zencoder/rules/repo.md` is not present. If you’d like, I can generate it to improve future automation and guidance.