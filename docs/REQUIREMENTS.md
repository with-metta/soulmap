# Requirements

This document catalogs feature requirements and their implementation status, keyed to requirement IDs.

## Terminology

- **REQ-Pnn** — "Product": core, user-facing features in shipped versions.
- **REQ-Nnn** — "Next": backlog, planned or in-progress.
- **REQ-OPnn** — "Operations": internal tooling (CI, deployment, observability).
- **REQ-NAVnn** — "Navigation": cross-cutting UI patterns.

## Product (REQ-P) — v0.1.0 ✅ shipped

### Prompt (REQ-P2): Journaling + AI reflection

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-P2-1 | Daily prompts, text entry, save to IndexedDB | v0.1.0 | ✅ |
| REQ-P2-2 | AI reflection (Claude) on each entry | v0.1.0 | ✅ |

### Values (REQ-P3): Profile assessment + AI synthesis

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-P3-1 | 10 values, 3-tier ranking, save profile | v0.1.0 | ✅ |
| REQ-P3-2 | AI synthesis of top values into profile text | v0.1.0 | ✅ |

### Insights (REQ-P4): Theme extraction + AI summary

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-P4-1 | Extract recurring themes from journal entries | v0.1.0 | ✅ |
| REQ-P4-2 | Show themes, theme counts, visual indicators | v0.1.0 | ✅ |

### Local persistence (REQ-P1)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-P1 | Local-first storage of entries + profiles (IndexedDB) | v0.1.0 | ✅ |

## Backlog (REQ-N) — "Suggested next features"

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-N1 | User accounts + cloud sync | — | ✅ |
| REQ-N2 | Ikigai mapper (4-circle diagram) | — | ✅ |
| REQ-N3 | Letter to future self (timed, sealed entry) | — | ✅ |
| REQ-N4 | Meditation / breathing timer | — | 💤 |
| REQ-N5 | Weekly digest (email or in-app) | — | 💤 |
| REQ-N8 | AI-extracted recurring themes (upgrades REQ-P4's heuristic pills) | — | ✅ |

- **REQ-N1**: implemented as Clerk (auth) + Neon Postgres (cloud storage of
  entries/values), not Supabase as originally scoped. IndexedDB remains the
  local-first cache (ADR-002); Postgres is the durable per-account store.
- **REQ-N2**: `/ikigai` — 2×2 textarea grid (love / good at / world needs /
  paid for), Claude synthesis, IndexedDB persistence. Linked from nav and
  home page.
- **REQ-N3**: `/letter` — compose a letter with a future unlock date; sealed
  until then. Local-first (IndexedDB) + cloud sync (Postgres via
  `/api/letters`), same pattern as journal entries.
- **REQ-N8**: `/api/themes` (Claude structured output) adds an "Uncover
  deeper themes" button on `/insights`; falls back to the REQ-P4 heuristic
  category pills if AI is unavailable or there are fewer than 3 entries.

## Navigation (REQ-NAV)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-NAV1 | Journaling streak counter | v0.1.0 | ✅ |

## Theme system (REQ-STYLE)

Tokens live in `app/globals.css` (`@theme`). Do not hardcode hex in components.

| Color | Hex | Usage |
|-------|-----|-------|
| `sage` | `#a39f9f` | Buttons, accents |
| `sage-dark` | `#6d6b6b` | Active states |
| `sage-light` | `#ccc7c7` | Backgrounds |
| `warm-dark` | `#8b6a47` | Error text |
| `warm-light` | `#e8dcc8` | Error backgrounds |
| `ink` | `#1a1816` | Primary text |
| `ink-soft` | `#6b6966` | Secondary text |
