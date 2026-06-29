@AGENTS.md

# SoulMap

A calm, non-prescriptive soul-searching app: guided journaling with AI
reflection, a values survey with an AI profile, and pattern insights. It helps
the user listen to themselves — it never tells them who to be.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind 4** — design tokens in `app/globals.css` (`@theme`), no config file
- **Anthropic SDK** (`claude-sonnet-4-6`) via server routes
- **IndexedDB** (`idb`) for local-first persistence
- See `AGENTS.md`: this Next.js differs from training data — check
  `node_modules/next/dist/docs/` before writing framework code.

## Run

```bash
cp .env.example .env.local   # then paste your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
npm run build                # production build (also typechecks)
npm run typecheck            # tsc --noEmit
npm run lint
```

The app loads and journaling/insights work without a key; the **AI features
(reflection, values profile) require `ANTHROPIC_API_KEY`** in `.env.local`.

## Layout

```
app/
  layout.tsx            Root layout + <Nav>
  page.tsx              Home (daily prompt, recent entries, pillars)
  journal/page.tsx      Journal screen
  values/page.tsx       Values survey
  insights/page.tsx     Insights screen
  api/reflect/route.ts  Journal reflection → { reflection, question }
  api/values/route.ts   Values profile → { profile }
components/             Nav, Button (shared UI)
lib/
  types.ts              Domain types (storage-agnostic)
  content.ts            Static content: moods, prompts, 16 values
  db.ts                 IndexedDB data layer + streak (the ONLY storage access)
  insights.ts           Pure analytics over entries (testable, no DOM)
  ai/
    client.ts           Anthropic client + MODEL constant
    prompts.ts          System prompts (verbatim from spec)
    errors.ts           SDK error → user-safe { error } + status
docs/                   REQUIREMENTS.md, DECISIONS.md
```

## Conventions

- **Design tokens only** — use `bg-sage`, `text-ink-soft`, `font-serif`, etc.
  Never hardcode hex in components; add/change tokens in `globals.css` (REQ-D*).
- **Storage goes through `lib/db.ts`** — components never open IndexedDB
  directly, so a future Supabase backend can swap in (ADR-002).
- **AI key is server-only** — only `app/api/*` and `lib/ai/*` touch it (ADR-001).
- **Trace work to requirements** — reference `REQ-*` IDs (see
  `docs/REQUIREMENTS.md`) in commits and code comments; log shipped work in
  `CHANGELOG.md` and the decisions behind it in `docs/DECISIONS.md`.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, …); tag releases `vX.Y.Z`.

## AI notes

- Journal route uses **structured outputs** (`messages.parse` + Zod) to
  guarantee `{reflection, question}` (ADR-003). Values returns plain text.
- Reflections run `thinking: disabled`, `effort: low` — fast + cheap, fits the
  calm UX.
- System prompts carry a `cache_control` breakpoint, but they're below Sonnet
  4.6's ~2048-token cache minimum, so caching won't engage until they grow
  (ADR-004) — this is expected, not a bug.
