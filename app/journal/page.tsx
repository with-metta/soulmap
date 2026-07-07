"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { MOODS, PROMPTS } from "@/lib/content";
import type { AIReflection, JournalEntry, MoodId, PromptCategory } from "@/lib/types";
import { dayKey, getEntries, newId, saveEntry } from "@/lib/db";
import { Button } from "@/components/Button";

function JournalScreen() {
  const params = useSearchParams();
  const initialCategory = (params.get("prompt") as PromptCategory) || "avoidance";
  const initialIndex = Math.max(
    0,
    PROMPTS.findIndex((p) => p.category === initialCategory),
  );

  const { isSignedIn, isLoaded } = useUser();

  const [promptIndex, setPromptIndex] = useState(initialIndex);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [body, setBody] = useState("");
  const [reflection, setReflection] = useState<AIReflection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [prefilling, setPrefilling] = useState(true);

  const prompt = PROMPTS[promptIndex];
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  // Pre-fill today's entry, if one already exists, so returning to the
  // journal later the same day shows what you wrote instead of a blank
  // page. Cloud-first for signed-in users (mirrors the home page's
  // DashboardView), falling back to local IndexedDB.
  useEffect(() => {
    if (!isLoaded) return;

    const load: Promise<JournalEntry[]> = isSignedIn
      ? fetch("/api/entries")
          .then((r) => r.json())
          .then((d) => {
            if (!Array.isArray(d.entries)) throw new Error("Unexpected response");
            return d.entries as JournalEntry[];
          })
          .catch(() => getEntries())
      : getEntries();

    load
      .then((entries) => {
        const today = entries.find((e) => dayKey(e.createdAt) === dayKey(Date.now()));
        if (!today) return;
        setBody(today.body);
        setMood(today.mood);
        if (today.reflection) setReflection(today.reflection);
        const idx = PROMPTS.findIndex((p) => p.category === today.promptCategory);
        if (idx >= 0) setPromptIndex(idx);
        setSaved(true);
      })
      .catch(() => {})
      .finally(() => setPrefilling(false));
  }, [isLoaded, isSignedIn]);

  function selectPrompt(i: number) {
    setPromptIndex(i);
    setReflection(null);
    setSaved(false);
  }

  async function getReflection() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.text, entry: body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      const ai = data as AIReflection;
      setReflection(ai);

      const entry = {
        id: newId(),
        createdAt: Date.now(),
        mood,
        promptCategory: prompt.category,
        promptText: prompt.text,
        body,
        reflection: ai,
      };

      // Local IndexedDB save (offline fallback).
      await saveEntry(entry);

      // Cloud save (fire-and-forget).
      fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch(() => {});

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="label">Journal</p>
        <h1 className="heading text-3xl">A space to listen to yourself</h1>
      </div>

      {/* Mood check-in */}
      <section className="space-y-3">
        <p className="label">How are you arriving?</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(mood === m.id ? null : m.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                mood === m.id
                  ? "border-sage bg-sage text-white"
                  : "border-black/15 text-ink-soft hover:bg-black/4"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* Prompt picker */}
      <section className="space-y-3">
        <p className="label">Choose a prompt</p>
        <div className="flex flex-wrap gap-2">
          {PROMPTS.map((p, i) => (
            <button
              key={p.category}
              onClick={() => selectPrompt(i)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                i === promptIndex
                  ? "bg-warm text-white"
                  : "bg-warm-light text-warm-dark hover:opacity-80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="panel-accent rounded-r-lg p-4">
          <p className="heading text-lg leading-snug">{prompt.text}</p>
        </div>
      </section>

      {/* Writing space — gated behind sign-in */}
      {isLoaded && !isSignedIn ? (
        <section className="card space-y-3 p-6 text-center">
          <p className="text-ink-soft">
            Sign in to save your reflections and build your journal.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-lg bg-sage px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-dark transition-colors">
              Sign in to continue
            </button>
          </SignInButton>
        </section>
      ) : !isLoaded || prefilling ? (
        <section className="flex items-center justify-center py-8">
          <p className="text-ink-soft">Loading your journal…</p>
        </section>
      ) : (
        <section className="space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write freely. No one is reading over your shoulder."
            rows={10}
            className="card w-full resize-y p-4 font-serif text-base leading-relaxed text-ink outline-none focus:border-sage"
          />
          <div className="flex items-center justify-between">
            <span className="label">{wordCount} words</span>
            <Button onClick={getReflection} disabled={loading || wordCount === 0}>
              {loading ? "Reflecting…" : "Get reflection"}
            </Button>
          </div>
        </section>
      )}

      {error && (
        <p className="rounded-lg bg-warm-light px-4 py-3 text-sm text-warm-dark">
          {error}
        </p>
      )}

      {reflection && (
        <section className="panel-accent space-y-3 rounded-r-lg p-5">
          <p className="label">A reflection</p>
          <p className="font-serif text-lg leading-relaxed text-sage-dark">
            {reflection.reflection}
          </p>
          <p className="font-serif text-lg italic leading-relaxed text-ink">
            {reflection.question}
          </p>
          {saved && <p className="label">Saved to your journal</p>}
        </section>
      )}
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={null}>
      <JournalScreen />
    </Suspense>
  );
}
