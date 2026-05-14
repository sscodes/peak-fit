# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm**.

- `pnpm dev` — Vite dev server (development mode)
- `pnpm stg` — Vite dev server (staging mode)
- `pnpm start` — Vite dev server (production mode)
- `pnpm build` — production build (`build:staging` for staging)
- `pnpm preview` — preview production build on port 3000
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint on `src/**/*.{ts,tsx}` with `--max-warnings 0`

There is no test runner configured in this repo.

One-off maintenance scripts live in [scripts/](scripts/) (workout backup, deduplication, onboarding question import) and are run with `tsx` (e.g. `pnpm exec tsx scripts/backupWorkouts.ts`).

## Architecture

### Entry & routing
- [src/main.tsx](src/main.tsx) wires the providers in this order: `QueryClientProvider` → Redux `Provider` → `RouterProvider`. The whole app is wrapped in an `ErrorBoundary` and an `AuthInitializer` that hydrates the auth slice from Supabase before rendering `App`.
- [src/App.tsx](src/App.tsx) splits routes into three top-level branches:
  - `/error/*` — error pages
  - `/auth/*` behind `PublicRoute` — sign-in/up, verify-email, forgot/reset password ([src/modules/auth/AuthRouter.tsx](src/modules/auth/AuthRouter.tsx))
  - `/*` behind `PrivateRoute` — everything else, mounted via [src/routes/private-route/PrivateRoutes.tsx](src/routes/private-route/PrivateRoutes.tsx) inside `MasterLayout`
- Authenticated route components in `PrivateRoutes.tsx` are all `React.lazy`-loaded and wrapped in a local `SuspendedView` (Suspense + `TopBarProgress` fallback). When adding a new authenticated page, follow the same lazy + `SuspendedView` pattern.
- Route path constants live in [src/helpers/getters.ts](src/helpers/getters.ts) — import from there rather than hard-coding paths.

### State management
- **Redux Toolkit** ([src/store/](src/store/)) holds session/user/profile state in `authSlice`. The store explicitly whitelists non-serializable Supabase objects (`session`, `user`, `profile`) via `ignoredActions`/`ignoredPaths` — if you add a slice that stores Supabase objects, extend that config rather than disabling `serializableCheck`.
- Use the typed hooks in [src/hooks/redux](src/hooks/redux) (e.g. `useAppSelector`), not raw `useSelector`/`useDispatch`.
- **TanStack Query** is the layer for server state. Global defaults (`staleTime: 5min`, `retry: 1`, no refetch-on-focus) are set in `main.tsx`. All query keys go through the factories in [src/services/query-key-factory.ts](src/services/query-key-factory.ts) (`authKeys`, `profileKeys`, `workoutKeys`) — don't inline string-array keys.

### Backend
Supabase (Auth + Postgres + Edge Functions) via `@supabase/supabase-js`. AI plan generation/parsing happens in Edge Functions, not the client. RLS is enforced server-side. Service wrappers live in [src/services/](src/services/) (`auth`, `profile`, `onboarding`, `workouts`).

### Module layout
Feature modules in [src/modules/](src/modules/) (`auth`, `coach`, `dashboard`, `explore`, `settings`, `error`) follow a `containers/` (route-level pages) + `components/` (module-local UI) + optional `utils/` convention. Shared primitives (button, input, select, loader, stepper, etc.) live in [src/components/](src/components/) and are styled with CSS Modules (`*.module.css`).

### Build
[vite.config.ts](vite.config.ts) defines manual chunking — Three.js, forms (formik/yup), router, query, supabase, redux, and misc UI libs each get their own vendor chunk. `chunkSizeWarningLimit` is bumped to 1300 to accommodate the Three.js bundle. The `@locator/babel-jsx` plugin is enabled only in development. Preserve this chunking when adding heavy deps — add new large libraries to a `manualChunks` group rather than letting them bleed into the main bundle.

## Conventions
- Path alias `@/*` → `src/*` is configured in both [vite.config.ts](vite.config.ts) (`resolve.alias`) and [tsconfig.app.json](tsconfig.app.json) (`paths`). Use `@/...` for cross-folder imports; keep `./` only for same-directory sibling files. If you add a new top-level path mapping, update both configs together.
- CSS Modules everywhere (`import classes from "./Foo.module.css"`).
- `package.json` declares `"sideEffects": ["*.css"]` — CSS imports are preserved through tree-shaking; keep importing module CSS at the top of components.
- ESLint runs with `--max-warnings 0`; `react-hooks` recommended rules and `react-refresh/only-export-components` are enforced.
