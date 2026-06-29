"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEntries } from "@/lib/db";
import { promptByCategory } from "@/lib/content";
import {
  moodByWeekday,
  patternObservation,
  suggestedCategories,
  themeCounts,
  WEEKDAY_LABELS,
} from "@/lib/insights";
import type { JournalEntry } from "@/lib/types";

// Tailwind background classes cycled across theme tags.
const TAG_COLORS = [
  "bg-sage-light text-sage-dark",
  "bg-warm-light text-warm-dark",
  "bg-sage text-white",
  "bg-warm text-white",
  "bg-black/5 text-ink-soft",
];

export default function InsightsPage() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    getEntries().then(setEntries).catch(() => setEntries([]));
  }, []);

  if (entries === null) {
    return <p className="text-ink-muted">Loading…</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="space-y-3">
        <p className="label">Insights</p>
        <h1 className="heading text-3xl">Nothing to see yet</h1>
        <p className="text-ink-soft">
          Insights appear once you&apos;ve written a few times. Start in the{" "}
          <Link href="/journal" className="text-sage-dark underline">
            Journal
          </Link>
          .
        </p>
      </div>
    );
  }

  const themes = themeCounts(entries);
  const days = moodByWeekday(entries);
  const maxDay = Math.max(...days, 1);
  const observation = patternObservation(entries);
  const suggestions = suggestedCategories(entries);

  return (
    <div className="space-y-10">
      <div>
        <p className="label">Insights</p>
        <h1 className="heading text-3xl">What your writing reveals</h1>
      </div>

      {/* Recurring themes */}
      <section className="space-y-3">
        <p className="label">Recurring themes</p>
        <div className="flex flex-wrap gap-2">
          {themes.map((t, i) => (
            <span
              key={t.category}
              className={`rounded-full px-3 py-1 text-sm capitalize ${
                TAG_COLORS[i % TAG_COLORS.length]
              }`}
            >
              {t.category} · {t.count}
            </span>
          ))}
        </div>
      </section>

      {/* Mood / activity by day of week */}
      <section className="space-y-3">
        <p className="label">When you reflect</p>
        <div className="card flex items-end justify-between gap-2 p-4">
          {days.map((count, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t bg-sage"
                style={{ height: `${(count / maxDay) * 96 + 4}px` }}
                title={`${count} ${count === 1 ? "entry" : "entries"}`}
              />
              <span className="label">{WEEKDAY_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pattern observation */}
      {observation && (
        <section className="panel-accent space-y-2 rounded-r-lg p-5">
          <p className="label">An observation</p>
          <p className="font-serif text-lg leading-relaxed text-sage-dark">
            {observation}
          </p>
        </section>
      )}

      {/* Suggested questions */}
      <section className="space-y-3">
        <p className="label">Questions you haven&apos;t sat with</p>
        <ul className="space-y-3">
          {suggestions.map((category) => {
            const prompt = promptByCategory(category);
            if (!prompt) return null;
            return (
              <li key={category}>
                <Link
                  href={`/journal?prompt=${category}`}
                  className="card block p-4 hover:border-black/20"
                >
                  <p className="font-serif text-ink">{prompt.text}</p>
                  <p className="label mt-1">Reflect on this →</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
