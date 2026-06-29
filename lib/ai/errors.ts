import Anthropic from "@anthropic-ai/sdk";

// Shared mapping from SDK/runtime errors to a user-safe { error } body +
// HTTP status. Used by both AI routes so failure handling stays consistent.

export function errorStatus(err: unknown): number {
  if (err instanceof Anthropic.APIError && err.status) return err.status;
  return 500;
}

export function errorBody(err: unknown): { error: string } {
  if (err instanceof Anthropic.AuthenticationError) {
    return { error: "AI is not configured (invalid or missing API key)." };
  }
  if (err instanceof Anthropic.RateLimitError) {
    return { error: "Too many requests right now — give it a moment." };
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  return { error: message };
}
