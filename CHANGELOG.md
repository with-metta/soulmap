# Changelog

All notable changes to SoulMap are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project adheres
to [Semantic Versioning](https://semver.org/). Entries reference requirement
IDs from `docs/REQUIREMENTS.md`.

## [Unreleased]

### Added
- **AI-extracted recurring themes** (REQ-N8): new `POST /api/themes` route uses
  Claude structured output (`messages.parse` + Zod) to extract 3–6 specific,
  emotionally resonant themes from journal entries. On the Insights screen the
  heuristic category pills remain visible by default; clicking "Uncover deeper
  themes" (shown when ≥ 3 entries exist) replaces them with AI-generated theme
  pills. Loading, success, and error states are all handled.
- `THEMES_SYSTEM_PROMPT` added to `lib/ai/prompts.ts`.
- **Ikigai mapper** (`/ikigai`): four-field 2×2 grid (love / good at / world
  needs / paid for), Clerk-gated "Find my Ikigai" button, Claude plain-text
  analysis via `/api/ikigai`, and local-first IndexedDB persistence with
  pre-fill on return visits (REQ-N2).
- Nav tab "Ikigai" inserted between Values and Insights.
- `IkigaiEntry` type in `lib/types.ts`; `ikigai` IndexedDB store (DB v2 with
  versioned upgrade callback); `saveIkigai` / `getLatestIkigai` in `lib/db.ts`.
- `IKIGAI_SYSTEM_PROMPT` in `lib/ai/prompts.ts`.

## [0.1.0] — 2026-06-29

First working build: all four screens, both AI features, local persistence.

### Added
- Next.js 16 (App Router) + TypeScript + Tailwind 4 scaffold.
- Design system as Tailwind `@theme` tokens — sage/warm/ink/cream palette,
  Georgia serif + system-ui, card/button/pill/panel primitives (REQ-D1–D3).
- Sticky top nav with four tabs and a journaling streak counter (REQ-NAV1–2).
- **Home**: prompt of the day, pillar links, recent entries (REQ-NAV1).
- **Journal**: mood selector, 5 prompt categories, serif textarea with live
  word count, AI reflection panel; entries saved locally (REQ-J1–J5).
- **Values**: 16-value survey (select ≤7, unlock at 3+), AI values profile
  (REQ-V1–V4).
- **Insights**: recurring-theme tags, activity-by-weekday chart, one pattern
  observation, deep-linked suggested prompts (REQ-I1–I4).
- AI server routes `/api/reflect` (structured JSON) and `/api/values` (plain
  text) on `claude-sonnet-4-6`, key kept server-side, system-prompt cache
  breakpoints (REQ-AI1–AI4).
- Local-first IndexedDB persistence via `idb` behind a typed data layer
  (REQ-P1).
- Project docs: REQUIREMENTS, DECISIONS (ADR-001–004), this changelog.

[Unreleased]: https://github.com/with-metta/soulmap/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/with-metta/soulmap/releases/tag/v0.1.0
