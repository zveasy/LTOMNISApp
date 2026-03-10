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
| Dev server | `cd backend && npm run dev` |
| Build | `cd backend && npm run build` |
| TypeScript check | `cd backend && npx tsc --noEmit` |

### Non-obvious caveats

- **Dual lockfiles**: Both `package-lock.json` and `yarn.lock` exist. Either `npm install` or `yarn install` works; `yarn install` is also confirmed to work.
- **Metro port**: The Metro bundler is configured to run on port **8084** (not the default 8081). See `metro.config.js`.
- **No native builds in cloud**: iOS/Android simulators are unavailable in the cloud VM. You can still validate JS bundle compilation by requesting `http://localhost:8084/index.bundle?platform=android&dev=true&minify=false` from the running Metro server.
- **TypeScript errors (frontend)**: `npx tsc --noEmit` reports some pre-existing errors (missing module references in `navigation/OnboardingNavigator.tsx` and `screens/auth/CreateNewPassword.tsx`). These are existing codebase issues, not environment problems.
- **TypeScript errors (backend)**: `cd backend && npx tsc --noEmit` has a pre-existing error in `database.ts` (TS4023 on exported `db` variable). Route files compile cleanly.
- **ESLint warnings/errors**: `npm run lint` exits with code 1 due to ~3700 existing prettier/style issues. This is expected and not a setup failure.
- **Jest setup**: Tests use extensive React Native mocks defined in `jestSetup.js`. The mock file at `__mocks__/fileMock.js` handles static assets.
