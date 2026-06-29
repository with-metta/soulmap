# SoulMap

A personal reflection app built on three pillars of soul-searching:

1. **Quiet reflection** — guided journaling with AI-powered insight
2. **Structured frameworks** — a values survey to discover what matters
3. **Honest feedback** — patterns, themes, and questions from your writing

Calm, warm, and non-prescriptive. It doesn't tell you who to be — it helps you
hear yourself more clearly.

## Quick start

```bash
cp .env.example .env.local        # paste your ANTHROPIC_API_KEY
npm install
npm run dev                       # http://localhost:3000
```

Journaling, values selection, and insights work with no key. The **AI
reflection** and **values profile** need `ANTHROPIC_API_KEY` (Anthropic Console
→ API keys). Your entries are stored **locally in your browser** (IndexedDB) —
nothing is uploaded except the text you send for a reflection.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Anthropic SDK
(`claude-sonnet-4-6`) · IndexedDB (`idb`).

## Docs

- `CLAUDE.md` — architecture, conventions, how to run
- `docs/REQUIREMENTS.md` — traceable requirements + backlog
- `docs/DECISIONS.md` — architecture decision records
- `CHANGELOG.md` — release notes

## Scripts

| Command | What |
|---------|------|
| `npm run dev` | Dev server |
| `npm run build` | Production build (typechecks) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
