"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PROMPTS } from "@/lib/content";
import { getRecentEntries } from "@/lib/db";
import type { JournalEntry } from "@/lib/types";

// Deterministic "prompt of the day" so it's stable across a calendar day.
function dailyPrompt() {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((Date.now() - start) / 86_400_000);
  return PROMPTS[dayOfYear % PROMPTS.length];
}

const PILLARS = [
  { href: "/journal", title: "Journal", blurb: "Quiet reflection with a gentle mirror." },
  { href: "/values", title: "Values", blurb: "Discover what truly matters to you." },
  { href: "/insights", title: "Insights", blurb: "Patterns and themes from your writing." },
];

export default function HomePage() {
  const prompt = dailyPrompt();
  const [recent, setRecent] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    getRecentEntries(3).then(setRecent).catch(() => setRecent([]));
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <p className="label">Today</p>
        <h1 className="heading text-3xl">Welcome back</h1>
      </div>

      {/* Daily prompt */}
      <section className="panel-accent rounded-r-lg p-5">
        <p className="label">Today&apos;s prompt</p>
        <p className="heading mt-1 text-xl leading-snug">{prompt.text}</p>
        <Link
          href={`/journal?prompt=${prompt.category}`}
          className="mt-3 inline-block rounded-lg bg-sage px-4 py-2 text-sm font-medium text-white hover:bg-sage-dark"
        >
          Reflect on this
        </Link>
      </section>

      {/* Pillars */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <Link key={p.href} href={p.href} className="card p-4 hover:border-black/20">
            <p className="heading text-lg">{p.title}</p>
            <p className="mt-1 text-sm text-ink-soft">{p.blurb}</p>
          </Link>
        ))}
      </section>

      {/* Recent entries */}
      <section className="space-y-3">
        <p className="label">Recent entries</p>
        {recent === null ? (
          <p className="text-ink-muted">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-ink-soft">
            Nothing yet. Your first reflection is waiting in the{" "}
            <Link href="/journal" className="text-sage-dark underline">
              Journal
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {recent.map((e) => (
              <li key={e.id} className="card p-4">
                <p className="label">
                  {new Date(e.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {e.promptCategory}
                  {e.mood ? ` · ${e.mood}` : ""}
                </p>
                <p className="mt-1 line-clamp-2 font-serif text-ink">{e.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
