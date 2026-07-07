# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- **Meditation / breathing timer** (REQ-N4): `/meditation` offers preset
  session lengths (1/3/5/10 min), a box-breathing circle (inhale/hold/exhale/
  hold, 4s each) driven off a single interval so the countdown and animation
  never drift, and Start/Pause/Reset controls with a proper effect cleanup so
  a dangling interval can't outlive a pause or navigation. Stateless utility —
  no AI, no auth gate, no cloud sync. Completed sessions save locally as
  `MeditationSession` (`sessions` store, IndexedDB v4) and a running count is
  shown on the page. Linked from `components/Nav.tsx` and the home page's
  pillars/features lists (grid bumped to 6 columns).
- **Accounts + cloud sync** (REQ-N1): Clerk authentication gates content
  creation (journal, values); signed-in users' entries and values profiles
  cloud-sync to Neon Postgres (`lib/db-server.ts`) via `/api/entries` and
  `/api/user-values`, in addition to the local IndexedDB copy. Previously
  shipped without a changelog entry — documented here for traceability.
- **Letter to your future self** (REQ-N3): `/letter` lets a signed-in user
  write a `LetterEntry` (body + unlock date) that stays sealed until
  `unlockAt`. Saved locally to IndexedDB (`letters` store, DB v3) and
  cloud-synced via `/api/letters` (`GET`/`POST`, Clerk-protected). Sealed
  letters hide their body until the unlock date passes.
- **Fix Ikigai unreachable + unprotected (REQ-N2)**: Added `/ikigai` to
  `components/Nav.tsx` and to the home page's pillars/features lists, so the
  page is reachable from the UI. Added `/api/ikigai(.*)` to the Clerk route
  matcher in `proxy.ts` so the Anthropic-backed endpoint requires
  authentication like `/api/reflect` and `/api/values`.
- **Fix Insights ignoring cloud-synced entries (REQ-N8)**: `/insights` read
  only local IndexedDB via `getEntries()`, so a signed-in user whose entries
  live in Neon (written on another device, or after local storage was
  cleared) saw a degraded or empty page and never got the "Uncover deeper
  themes" button. `app/insights/page.tsx` now mirrors the home page's
  `DashboardView`: signed-in users fetch `/api/entries`, falling back to
  local `getEntries()` on failure; signed-out users are unchanged. The cloud
  fetch now also verifies the response shape before using it, so a non-200
  response with a JSON body (e.g. a stale-session 401) falls back to local
  entries instead of crashing the page.
- **Test coverage for `/api/themes`** (REQ-N8): Added Vitest as the project's
  test runner (`vitest.config.ts`, `npm run test`) and mocked unit tests
  covering the happy path and the < 3 entries validation error. Also removed
  the two remaining `any` types in `app/api/themes/route.ts` in favor of a
  small hand-written type for the model's `parsed_output` shape. Scoped
  Vitest's global types to the test files themselves (explicit `vitest`
  imports) instead of the project-wide `tsconfig.json`, to avoid
  inadvertently narrowing automatic `@types/*` inclusion project-wide.

## [0.1.0] — 2026-06-29

- **Daily prompt** (`/journal`): random prompt from a library, text input for
  reflection, "Save reflection" button. Saves `JournalEntry` (id, timestamp,
  prompt, reflection) to IndexedDB. On submit, calls `/api/journal` to get
  Claude's reflection. Shows loading state, errors, success. Pre-fills on
  return to the same day.
- `JOURNAL_SYSTEM_PROMPT` added to `lib/ai/prompts.ts`.
- Auto-scroll to today's entry if it exists.

## Values (REQ-P3)

- **Values page** (`/values`): Rank 10 predefined values (autonomy, security,
  impact, etc.) on 3 tiers. Save to IndexedDB as a `ValuesProfile`. On submit,
  call `/api/values` to send Claude the top 3 values + ranking; Claude returns
  a reflection. Pre-fill on return; clear before re-ranking.
- `VALUES_SYSTEM_PROMPT` added to `lib/ai/prompts.ts`.

## Insights (REQ-P4)

- **Themes system** (`/insights`): shows recurring themes in journal entries
  using Claude. Entries are sent to `/api/themes`, which extracts 3–6 themes
  as a JSON list of theme objects. Themes UI pages entry counts (shown when
  ≥ 3 entries exist) replaces them with AI-generated theme pills. Loading,
  success, and error states are all handled.
- `THEMES_SYSTEM_PROMPT` added to `lib/ai/prompts.ts`.

## Navigation & Layout

- **Nav bar** (`components/Nav.tsx`): Home, Journal, Values, Insights. Active
  route highlighted. Centered layout with `HomeLayout`.
- **Streak counter** (REQ-NAV1): Shows consecutive days journaled (today
  optional). Resets if a day is skipped. Persisted via IndexedDB.

## Local persistence (REQ-P1)

- **IndexedDB** (`lib/db.ts`): Stores `JournalEntry` and `ValuesProfile` in
  local object stores, each with a `byCreatedAt` index. No backend sync yet;
  all data stays on device. Future: add Supabase backend.

## Design tokens

- **Colors, fonts, spacing**: Tailwind config + global CSS vars (`@theme` in
  `app/globals.css`). Semantic token names (sage, warm, ink) map to hex codes.
  Do not hardcode hex.
