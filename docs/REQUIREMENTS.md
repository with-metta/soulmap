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
|----|----|-------------|--------|
| REQ-P2-1 | Daily prompts, text entry, save to IndexedDB | v0.1.0 | ✅ |
| REQ-P2-2 | AI reflection (Claude) on each entry | v0.1.0 | ✅ |

### Values (REQ-P3): Profile assessment + AI synthesis

| ID | Requirement | Version | Status |
|----|----|-------------|--------|
| REQ-P3-1 | 10 values, 3-tier ranking, save profile | v0.1.0 | ✅ |
| REQ-P3-2 | AI synthesis of top values into profile text | v0.1.0 | ✅ |

### Insights (REQ-P4): Theme extraction + AI summary

| ID | Requirement | Version | Status |
|----|----|-------------|--------|
| REQ-P4-1 | Extract recurring themes from journal entries | v0.1.0 | ✅ |
| REQ-P4-2 | Show themes, theme counts, visual indicators | v0.1.0 | ✅ |

### Local persistence (REQ-P1)

| ID | Requirement | Version | Status |
|----|----|-------------|--------|
| REQ-P1 | Local-first storage of entries + profiles (IndexedDB) | v0.1.0 | ✅ |

## Ikigai (REQ-N2)

| ID | Requirement | Version | Status |
|----|----|-------------|--------|
| REQ-N2 | Ikigai mapper — 4-field input, AI analysis, local persistence | v0.2.0 | ✅ |
| REQ-N2-UX | Enhanced UX — loading state, character counters, success feedback, timeout handling | v0.2.0 | ✅ |

## Backlog (REQ-N) — "Suggested next features"

| ID | Requirement | Version | Status |
|----|----|-------------|--------|
| REQ-N1 | User accounts + cloud sync (Supabase) | — | 💤 |
| REQ-N3 | Letter to future self (timed, sealed entry) | — | 💤 |
| REQ-N4 | Meditation / breathing timer | — | 💤 |
| REQ-N5 | Weekly digest (email or in-app) | — | 💤 |

## Navigation (REQ-NAV)

| ID | Requirement | Version | Status |
|----|----|-------------|--------|
| REQ-NAV1 | Journaling streak counter | v0.1.0 | ✅ |
| REQ-NAV2 | Tab navigation (Home / Journal / Values / Ikigai / Insights) | v0.2.0 | ✅ |

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
