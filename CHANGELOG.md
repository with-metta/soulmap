# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- **Letter to your future self** (REQ-N3): `/letter` lets a signed-in user
  write a `LetterEntry` (body + unlock date) that stays sealed until
  `unlockAt`. Saved locally to IndexedDB (`letters` store, DB v3) and
  cloud-synced via `/api/letters` (`GET`/`POST`, Clerk-protected). Sealed
  letters hide their body until the unlock date passes.

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
