"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
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

const FEATURES = [
  {
    title: "Quiet Reflection",
    blurb:
      "Journal your thoughts with a gentle AI mirror that asks the right questions, never judges.",
  },
  {
    title: "Know Your Values",
    blurb:
      "Discover what truly matters to you with a guided values survey and a personal profile.",
  },
  {
    title: "See Your Patterns",
    blurb:
      "Insights surface themes across your entries so you understand yourself a little better each week.",
  },
];

function LandingView() {
  return (
    <div className="space-y-14 py-4">
      {/* Hero */}
      <section className="space-y-4 text-center">
        <h1 className="heading font-serif text-4xl leading-snug text-ink sm:text-5xl">
          Looking for meaning in life?<br />
          Know yourself a little more?<br />
          Or find out what&apos;s next?
        </h1>
        <p className="font-serif text-xl text-sage-dark">
          Look no more; I promise the best of you!
        </p>
        <div className="pt-2">
          <SignInButton mode="modal">
            <button className="rounded-lg bg-sage px-6 py-3 text-base font-medium text-white hover:bg-sage-dark transition-colors">
              Start your journey
            </button>
          </SignInButton>
        </div>
      </section>

      {/* YouTube embed */}
      <section className="relative aspect-video w-full overflow-hidden rounded-xl">
        <iframe
          src="https://www.youtube.com/embed/h_L4Rixya64"
          title="SoulMap introduction"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </section>

      {/* Features */}
      <section className="space-y-4">
        <p className="label text-center">What you&apos;ll find here</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <p className="heading text-lg">{f.title}</p>
              <p className="mt-2 text-sm text-ink-soft">{f.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center">
        <SignInButton mode="modal">
          <button className="rounded-lg bg-sage px-6 py-3 text-base font-medium text-white hover:bg-sage-dark transition-colors">
            Start your journey
          </button>
        </SignInButton>
      </section>
    </div>
  );
}

function DashboardView() {
  const prompt = dailyPrompt();
  const { isSignedIn } = useUser();
  const [recent, setRecent] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/entries")
        .then((r) => r.json())
        .then((d) => setRecent((d.entries as JournalEntry[]).slice(0, 3)))
        .catch(() => getRecentEntries(3).then(setRecent));
    } else {
      getRecentEntries(3).then(setRecent).catch(() => setRecent([]));
    }
  }, [isSignedIn]);

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

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;
  return isSignedIn ? <DashboardView /> : <LandingView />;
}
