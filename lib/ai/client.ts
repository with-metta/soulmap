import Anthropic from "@anthropic-ai/sdk";

// Server-only Anthropic client. The API key never reaches the browser — see
// docs/DECISIONS.md ADR-001 (Next.js server routes chosen partly for this).

/** Model used for all reflections (REQ-AI1). Single source of truth. */
export const MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

/** Lazily construct the client so a missing key fails per-request (with a
 *  catchable error) rather than at module load / build time. */
export function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set — add it to .env.local");
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

/* Prompt caching note (honest caveat — see docs/DECISIONS.md ADR-004):
   Both system prompts are sent with a `cache_control: { type: "ephemeral" }`
   breakpoint. Sonnet 4.6's minimum cacheable prefix is ~2048 tokens; these
   prompts are far shorter, so the cache will NOT actually engage today
   (you'll see cache_creation_input_tokens: 0). The breakpoint is placed
   correctly so caching kicks in automatically if the prompts grow. */
