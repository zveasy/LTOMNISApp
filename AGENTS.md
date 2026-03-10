# AGENTS.md

## Cursor Cloud specific instructions

This is a React Native mobile app (LTOMNISApp) — a peer-to-peer lending/borrowing fintech platform. It is a **frontend-only** repository; the backend API (expected at `http://localhost:8080/api/omnis/`) is not included.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Lint | `npm run lint` |
| Test | `npm test` |
| Start Metro | `npm start` (runs on port 8084) |
| TypeScript check | `npx tsc --noEmit` |

### Non-obvious caveats

- **Dual lockfiles**: Both `package-lock.json` and `yarn.lock` exist. Use `npm install` (matches `package-lock.json`).
- **Metro port**: The Metro bundler is configured to run on port **8084** (not the default 8081). See `metro.config.js`.
- **No native builds in cloud**: iOS/Android simulators are unavailable in the cloud VM. You can still validate JS bundle compilation by requesting `http://localhost:8084/index.bundle?platform=android&dev=true&minify=false` from the running Metro server.
- **TypeScript errors**: `npx tsc --noEmit` reports some pre-existing errors (missing module references in `navigation/OnboardingNavigator.tsx` and `screens/auth/CreateNewPassword.tsx`). These are existing codebase issues, not environment problems.
- **ESLint warnings/errors**: `npm run lint` exits with code 1 due to ~3700 existing prettier/style issues. This is expected and not a setup failure.
- **Jest setup**: Tests use extensive React Native mocks defined in `jestSetup.js`. The mock file at `__mocks__/fileMock.js` handles static assets.
