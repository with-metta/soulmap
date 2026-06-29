# Architecture Decision Records

Lightweight ADRs — one entry per real fork. Newest first.

## ADR-004 — Prompt-cache breakpoint on system prompts (won't engage yet)

**Date:** 2026-06-29 · **Status:** Accepted

Both AI routes send the system prompt as a content block with
`cache_control: { type: "ephemeral" }`. Sonnet 4.6's minimum cacheable prefix
is ~2048 tokens; the current system prompts are ~150 tokens, so caching will
**not** actually engage (`cache_creation_input_tokens` will be 0). We place the
breakpoint anyway: it is correct, costs nothing, and starts paying off
automatically if the prompts grow past the threshold. Documented in
`lib/ai/client.ts` so it isn't mistaken for a bug.

## ADR-003 — Structured outputs for the journal reflection

**Date:** 2026-06-29 · **Status:** Accepted

The journal route must return `{reflection, question}`. Rather than ask for
JSON in the prompt and hand-parse free text, we use the SDK's structured
outputs (`client.messages.parse()` + `zodOutputFormat`). This guarantees a
valid, typed object or a clean error — no brittle string parsing. Values stays
plain text (the spec asks for prose), so it uses `messages.create()`.

## ADR-002 — Local-first persistence (IndexedDB) before any backend

**Date:** 2026-06-29 · **Status:** Accepted

v0.1 stores entries and values profiles in IndexedDB (via `idb`). The app works
fully with zero backend setup. All access goes through `lib/db.ts`, a typed
function surface the UI calls — a future Supabase backend (REQ-N1) can
implement the same surface without touching components.

## ADR-001 — Next.js (App Router) over plain HTML/JS

**Date:** 2026-06-29 · **Status:** Accepted

The plain-HTML option from the spec would expose the Anthropic API key in the
browser. Next.js server routes (`app/api/*`) keep the key secret and give a
clean path to Vercel + Supabase later. Cost: a build step and a Node runtime —
acceptable for the security and growth headroom.
