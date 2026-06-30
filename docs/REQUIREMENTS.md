# SoulMap — Requirements

Traceable requirements. Each has a stable ID, a status, and the version it
landed in. Reference IDs from code comments, commits, and CHANGELOG entries.

**Status key:** ✅ done · 🚧 in progress · ⬜ planned · 💤 backlog

## Design system (REQ-D)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-D1 | Palette tokens (sage / warm / ink / cream) | v0.1.0 | ✅ |
| REQ-D2 | Typography: Georgia serif (display/journal) + system-ui (UI) | v0.1.0 | ✅ |
| REQ-D3 | Components: cards, buttons, prompt cards, mood pills, value cards, AI panel | v0.1.0 | ✅ |

Tokens live in `app/globals.css` (`@theme`). Do not hardcode hex in components.

## Navigation (REQ-NAV)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-NAV1 | Sticky top nav, 4 tabs (Home/Journal/Values/Insights) | v0.1.0 | ✅ |
| REQ-NAV2 | Streak counter ("🔥 N-day streak") | v0.1.0 | ✅ |

## Journal (REQ-J)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-J1 | Mood selector (Calm/Heavy/Curious/Frustrated/Hopeful/Numb) | v0.1.0 | ✅ |
| REQ-J2 | 5 prompt categories (Avoidance/Identity/Relationships/Purpose/Fear) | v0.1.0 | ✅ |
| REQ-J3 | Serif textarea + live word count | v0.1.0 | ✅ |
| REQ-J4 | "Get reflection" → Claude → empathetic reflection + follow-up question | v0.1.0 | ✅ |
| REQ-J5 | AI response shown in styled panel | v0.1.0 | ✅ |

## Values (REQ-V)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-V1 | 16 values with name + one-line description | v0.1.0 | ✅ |
| REQ-V2 | Select up to 7 | v0.1.0 | ✅ |
| REQ-V3 | Profile unlocks at 3+ selections | v0.1.0 | ✅ |
| REQ-V4 | Claude generates 3–4 sentence values profile (tension + direction) | v0.1.0 | ✅ |

## Insights (REQ-I)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-I1 | Recurring themes panel with colored tags | v0.1.0 | ✅ |
| REQ-I2 | Mood/activity bar chart by day of week | v0.1.0 | ✅ |
| REQ-I3 | Single honest pattern observation | v0.1.0 | ✅ |
| REQ-I4 | Suggested questions deep-linking to Journal with prompt pre-loaded | v0.1.0 | ✅ |

## AI integration (REQ-AI)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-AI1 | Claude via server routes; key never in browser; model `claude-sonnet-4-6` | v0.1.0 | ✅ |
| REQ-AI2 | Journal reflection returns structured `{reflection, question}` JSON | v0.1.0 | ✅ |
| REQ-AI3 | Values reflection returns plain text | v0.1.0 | ✅ |
| REQ-AI4 | Prompt-cache breakpoint on system prompts (see ADR-004 caveat) | v0.1.0 | ✅ |

## Persistence (REQ-P)

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-P1 | Local-first storage of entries + profiles (IndexedDB) | v0.1.0 | ✅ |

## Backlog (REQ-N) — "Suggested next features"

| ID | Requirement | Version | Status |
|----|-------------|---------|--------|
| REQ-N1 | User accounts + cloud sync (Supabase) | — | 💤 |
| REQ-N2 | Ikigai mapper (4-circle diagram) | — | 💤 |
| REQ-N3 | Letter to future self (timed, sealed entry) | — | 💤 |
| REQ-N4 | Meditation / breathing timer | — | 💤 |
| REQ-N5 | Weekly digest (email or in-app) | — | 💤 |
| REQ-N6 | Therapist mode (read-only shared insights link) | — | 💤 |
| REQ-N7 | Mobile app (PWA / React Native) | — | 💤 |
| REQ-N8 | AI-extracted recurring themes (replace heuristic in REQ-I1/I3) | v0.2.0 | ✅ |
