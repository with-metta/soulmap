# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- **Ikigai mapper** (`/ikigai`): four-field 2×2 grid (love / good at / world
  needs / paid for), Clerk-gated "Find my Ikigai" button, Claude plain-text
  analysis via `/api/ikigai`, and local-first IndexedDB persistence with
  pre-fill on return visits (REQ-N2).
  - Loading state during data pre-fill with "Loading your previous entry…" message.
  - Character counters (current / max) under each textarea to guide input.
  - Success toast feedback ("✓ Saved successfully") after successful submission.
  - 30-second timeout on Claude API requests with user-friendly error message.
  - Refactored textarea rendering with DRY helper function.
- Nav tab "Ikigai" inserted between Values and Insights.
- `IkigaiEntry` type in `lib/types.ts`; `ikigai` IndexedDB store (DB v2 with
  versioned upgrade callback); `saveIkigai` / `getLatestIkigai` in `lib/db.ts`.
- `IKIGAI_SYSTEM_PROMPT` in `lib/ai/prompts.ts`.

## [0.1.0] — 2026-06-29
