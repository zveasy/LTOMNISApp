# AGENTS.md

## Cursor Cloud specific instructions

This is a React Native mobile app (LTOMNISApp) with an Express.js/TypeScript backend (`backend/`) — a peer-to-peer lending/borrowing fintech platform.

### Key commands (frontend)

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Lint | `npm run lint` |
| Test | `npm test` |
| Start Metro | `npm start` (runs on port 8084) |
| TypeScript check | `npx tsc --noEmit` |

### Key commands (backend — run from `backend/`)

| Task | Command |
|------|---------|
| Install deps | `cd backend && npm install` |
| Build | `cd backend && npm run build` |
| Start server | `cd backend && npm start` (port 8080) |
| Dev server | `cd backend && npm run dev` (port 8080, ts-node) |
| TypeScript check | `cd backend && npx tsc --noEmit` |

### Backend architecture

- **Stack**: Express.js + TypeScript + SQLite (better-sqlite3) + JWT auth
- **Port**: 8080 (all frontend API calls point to `http://localhost:8080/api/omnis/...`)
- **Database**: SQLite file at `backend/omnis.db` (auto-created on first run)
- **Auth**: JWT tokens via `Authorization: Bearer <token>` header; admin routes require `role: 'admin'`
- **File uploads**: Multer saves to `backend/uploads/`
- **Route modules**: auth, user, identity, score, community, posts, offers, contracts, disputes, ledger, payment, risk, admin, loan

### Non-obvious caveats

- **Dual lockfiles**: Both `package-lock.json` and `yarn.lock` exist. Either `npm install` or `yarn install` works; `yarn install` is also confirmed to work.
- **Metro port**: The Metro bundler is configured to run on port **8084** (not the default 8081). See `metro.config.js`.
- **No native builds in cloud**: iOS/Android simulators are unavailable in the cloud VM. You can still validate JS bundle compilation by requesting `http://localhost:8084/index.bundle?platform=android&dev=true&minify=false` from the running Metro server.
- **TypeScript errors (frontend)**: `npx tsc --noEmit` reports some pre-existing errors (missing module references in `navigation/OnboardingNavigator.tsx` and `screens/auth/CreateNewPassword.tsx`). These are existing codebase issues, not environment problems.
- **Backend DB reset**: Delete `backend/omnis.db` to start with a fresh database. It re-creates automatically on server start.
- **Backend .env**: The backend loads `backend/.env` via dotenv. Default dev values are pre-populated (PORT=8080, JWT_SECRET, DB_PATH, UPLOAD_DIR).
- **Backend build before start**: Always run `cd backend && npm run build` before `npm start`. The dev script (`npm run dev`) uses ts-node and doesn't need a build step.
- **Rate limiting**: Auth routes (`/account/*`) are rate-limited to 20 requests per 15-minute window.
- **Input validation**: Critical auth, offer, and payment routes use Zod schemas via `validate()` middleware. Registration also enforces password strength (uppercase + lowercase + digit).
- **ESLint warnings/errors**: `npm run lint` exits with code 1 due to ~3700 existing prettier/style issues. This is expected and not a setup failure.
- **Jest setup**: Tests use extensive React Native mocks defined in `jestSetup.js`. The mock file at `__mocks__/fileMock.js` handles static assets.
