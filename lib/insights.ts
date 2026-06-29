import type { JournalEntry, PromptCategory } from "./types";
import { PROMPTS } from "./content";

// Pure analytics derived from journal entries (REQ-I1..I4). No DOM / storage
// here so these can be unit-tested and reused.

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export interface Theme {
  category: PromptCategory;
  count: number;
}

/** Prompt categories the user returns to, most-used first (REQ-I1). */
export function themeCounts(entries: JournalEntry[]): Theme[] {
  const counts = new Map<PromptCategory, number>();
  for (const e of entries) {
    counts.set(e.promptCategory, (counts.get(e.promptCategory) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/** Entry count per weekday, index 0 = Sunday (REQ-I2). */
export function moodByWeekday(entries: JournalEntry[]): number[] {
  const buckets = new Array(7).fill(0) as number[];
  for (const e of entries) buckets[new Date(e.createdAt).getDay()] += 1;
  return buckets;
}

export const WEEKDAY_LABELS = WEEKDAYS;

/** Prompt categories used least (or never), for gentle suggestions (REQ-I4). */
export function suggestedCategories(
  entries: JournalEntry[],
  limit = 2,
): PromptCategory[] {
  const counts = new Map<PromptCategory, number>();
  for (const p of PROMPTS) counts.set(p.category, 0);
  for (const e of entries) {
    counts.set(e.promptCategory, (counts.get(e.promptCategory) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, limit)
    .map(([category]) => category);
}

/**
 * One honest, non-prescriptive observation about writing habits (REQ-I3).
 * Returns null when there isn't enough data to say anything truthful.
 */
export function patternObservation(entries: JournalEntry[]): string | null {
  if (entries.length < 3) return null;

  const themes = themeCounts(entries);
  const top = themes[0];
  const labelFor = (c: PromptCategory) =>
    PROMPTS.find((p) => p.category === c)?.label ?? c;

  // Lead with a returning theme if one clearly dominates.
  if (top && top.count >= 2 && top.count / entries.length >= 0.4) {
    return `You keep returning to ${labelFor(top.category)} — it seems to be asking for your attention.`;
  }

  // Otherwise note the most active day.
  const days = moodByWeekday(entries);
  const peak = days.indexOf(Math.max(...days));
  if (days[peak] >= 2) {
    return `You tend to reflect most on ${WEEKDAYS[peak]}s. There may be a rhythm worth noticing.`;
  }

  return `You've written ${entries.length} times. Returning, even briefly, is its own kind of listening.`;
}
