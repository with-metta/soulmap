@AGENTS.md

# SoulMap

A calm, non-prescriptive soul-searching app: guided journaling with AI
reflection, a values survey with an AI profile, an Ikigai mapper, sealed
letters to your future self, a meditation timer, and pattern insights (with
AI-extracted themes). It helps the user listen to themselves — it never tells
them who to be.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind 4** — design tokens in `app/globals.css` (`@theme`), no config file
- **Anthropic SDK** (`claude-sonnet-4-6`) via server routes
- **Clerk** for auth — gates content creation (journal, values, letters) and
  every Anthropic-backed route (ADR-005)
- **Neon Postgres** (`lib/db-server.ts`) for cloud sync of signed-in users'
  entries/values/letters, alongside **IndexedDB** (`idb`) as the local-first,
  no-account baseline (ADR-002)
- **Vitest** for tests (`npm run test`) — currently covers `/api/themes`
- See `AGENTS.md`: this Next.js differs from training data — check
  `node_modules/next/dist/docs/` before writing framework code.

## Run

```bash
cp .env.example .env.local   # then fill in the keys below
npm run dev                  # http://localhost:3000
npm run build                # production build (also typechecks)
npm run typecheck            # tsc --noEmit
npm run lint
npm run test                 # vitest run
```

The app loads and journaling/insights work locally without any keys.
- **AI features** (reflection, values profile, Ikigai, AI-extracted themes)
  need `ANTHROPIC_API_KEY`.
- **Accounts + cloud sync** need Clerk keys
  (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) and `DATABASE_URL`
  (Neon). See `.env.example` for the full list.

## Layout

```
app/
  layout.tsx                 Root layout + <Nav>
  page.tsx                   Home (daily prompt, recent entries, pillars)
  journal/page.tsx           Journal screen
  values/page.tsx            Values survey
  ikigai/page.tsx            Ikigai mapper — 2x2 grid + AI synthesis (REQ-N2)
  letter/page.tsx            Letter to your future self, sealed until unlock date (REQ-N3)
  meditation/page.tsx        Box-breathing timer — no AI, no auth, no cloud sync (REQ-N4)
  insights/page.tsx          Heuristic + AI-extracted recurring themes (REQ-N8)
  privacy/page.tsx           Privacy policy
  sign-in/, sign-up/         Clerk auth pages
  api/reflect/route.ts       Journal reflection → { reflection, question }
  api/values/route.ts        Values profile → { profile }
  api/ikigai/route.ts        Ikigai analysis → { analysis }
  api/themes/route.ts        AI-extracted themes → { themes }
  api/entries/route.ts       Cloud sync: journal entries (Clerk-protected)
  api/user-values/route.ts   Cloud sync: values profile (Clerk-protected)
  api/letters/route.ts       Cloud sync: sealed letters (Clerk-protected)
components/                  Nav, Button (shared UI)
lib/
  types.ts                   Domain types (storage-agnostic)
  content.ts                 Static content: moods, prompts, 16 values
  db.ts                      IndexedDB data layer + streak (the ONLY local storage access)
  db-server.ts                Neon Postgres cloud storage (ADR-005) — entries, values, letters
  insights.ts                 Pure analytics over entries (testable, no DOM)
  ai/
    client.ts                 Anthropic client + MODEL constant
    prompts.ts                 System prompts (verbatim from spec)
    errors.ts                  SDK error → user-safe { error } + status
proxy.ts                    Clerk middleware — gates AI + cloud-sync routes (see Conventions)
tests/                      Vitest unit tests
docs/                       REQUIREMENTS.md, DECISIONS.md
```

## Conventions

- **Design tokens only** — use `bg-sage`, `text-ink-soft`, `font-serif`, etc.
  Never hardcode hex in components; add/change tokens in `globals.css` (REQ-D*).
- **Local storage goes through `lib/db.ts`** — components never open
  IndexedDB directly. **Cloud storage goes through `lib/db-server.ts`** (Neon
  Postgres, keyed by Clerk `userId`) — API routes only, never client code
  (ADR-002, ADR-005).
- **AI key is server-only** — only `app/api/*` and `lib/ai/*` touch it (ADR-001).
- **Every AI-backed or content-creation API route must be added to
  `proxy.ts`'s `isProtectedRoute` matcher**, or it runs unauthenticated. Easy
  to miss when adding a new route — Ikigai shipped without it and had to be
  patched after the fact (REQ-N2 fix). If a route calls Anthropic or writes
  to Postgres, it belongs in that matcher.
- **Trace work to requirements** — reference `REQ-*` IDs (see
  `docs/REQUIREMENTS.md`) in commits and code comments; log shipped work in
  `CHANGELOG.md` and the decisions behind it in `docs/DECISIONS.md`.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, …); tag releases `vX.Y.Z`.

## AI notes

- Journal (`/api/reflect`) and themes (`/api/themes`) routes use **structured
  outputs** (`messages.parse` + Zod) to guarantee a typed shape (ADR-003).
  Values and Ikigai return plain text via `messages.create()`.
- Reflections run `thinking: disabled`, `effort: low` — fast + cheap, fits the
  calm UX.
- System prompts carry a `cache_control` breakpoint, but they're below Sonnet
  4.6's ~2048-token cache minimum, so caching won't engage until they grow
  (ADR-004) — this is expected, not a bug.
