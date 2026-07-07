# Architecture Decision Records

Lightweight ADRs — one entry per real fork. Newest first.

## ADR-005 — Clerk + Neon Postgres for accounts and cloud sync (REQ-N1)

**Date:** 2026-06-29 · **Status:** Accepted

ADR-002 originally scoped a "future Supabase backend" for REQ-N1. We shipped
Clerk (auth) + Neon Postgres (`lib/db-server.ts`) instead: Clerk handles
sign-in/session state with minimal setup, and Neon's serverless Postgres
driver works cleanly from Vercel Functions without connection-pooling
config. Content creation (journal, values) is gated behind sign-in; each
save writes to IndexedDB first (offline-capable, per ADR-002) and
fire-and-forget POSTs to Postgres keyed by Clerk `userId`. AI-backed routes
(`/api/reflect`, `/api/values`, `/api/ikigai`) and cloud-sync routes
(`/api/entries`, `/api/user-values`, `/api/letters`) are protected by a
single Clerk route matcher in `proxy.ts` — any new AI or content-creation
route must be added to that matcher, or it runs unauthenticated (see the
Ikigai fix, REQ-N2, which shipped without this and had to be patched).

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
function surface the UI calls — a future cloud backend (REQ-N1) can
implement the same surface without touching components. (Shipped as Clerk +
Neon Postgres, not Supabase — see ADR-005.)

## ADR-001 — Next.js (App Router) over plain HTML/JS

**Date:** 2026-06-29 · **Status:** Accepted

The plain-HTML option from the spec would expose the Anthropic API key in the
browser. Next.js server routes (`app/api/*`) keep the key secret and give a
clean path to Vercel + a cloud backend later (shipped as Clerk + Neon
Postgres — see ADR-005). Cost: a build step and a Node runtime — acceptable
for the security and growth headroom.
