"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { getLatestIkigai, saveIkigai, newId } from "@/lib/db";
import { Button } from "@/components/Button";

export default function IkigaiPage() {
  const { isSignedIn, isLoaded } = useUser();

  const [love, setLove] = useState("");
  const [goodAt, setGoodAt] = useState("");
  const [worldNeeds, setWorldNeeds] = useState("");
  const [paidFor, setPaidFor] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from the most recent saved entry on mount.
  useEffect(() => {
    getLatestIkigai()
      .then((entry) => {
        if (!entry) return;
        setLove(entry.love);
        setGoodAt(entry.goodAt);
        setWorldNeeds(entry.worldNeeds);
        setPaidFor(entry.paidFor);
        setAnalysis(entry.analysis);
      })
      .catch(() => {});
  }, []);

  const canSubmit = love.trim() && goodAt.trim() && worldNeeds.trim() && paidFor.trim();

  async function findIkigai() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ikigai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ love, goodAt, worldNeeds, paidFor }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      setAnalysis(data.analysis);

      const entry = {
        id: newId(),
        createdAt: Date.now(),
        love,
        goodAt,
        worldNeeds,
        paidFor,
        analysis: data.analysis,
      };

      await saveIkigai(entry);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const textareaClass =
    "font-serif w-full resize-none rounded-xl border border-black/8 bg-white/60 p-4 h-32 text-ink focus:outline-none focus:border-sage";

  return (
    <div className="space-y-8">
      <div>
        <p className="label">Ikigai</p>
        <h1 className="heading text-3xl">Find your reason for being</h1>
        <p className="mt-2 text-ink-soft">
          Ikigai lives at the intersection of what you love, what you are good
          at, what the world needs, and what you can be paid for. Fill in each
          circle honestly — there are no right answers.
        </p>
      </div>

      {/* 2×2 grid with centered label between rows */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Row 1 */}
        <div className="space-y-1.5">
          <label className="label block">What you love</label>
          <textarea
            className={textareaClass}
            placeholder="Things that energise and absorb you…"
            value={love}
            onChange={(e) => setLove(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="label block">What you&apos;re good at</label>
          <textarea
            className={textareaClass}
            placeholder="Skills, talents, natural strengths…"
            value={goodAt}
            onChange={(e) => setGoodAt(e.target.value)}
          />
        </div>

        {/* Centre label spanning full width */}
        <p className="label text-center col-span-1 sm:col-span-2">Ikigai</p>

        {/* Row 2 */}
        <div className="space-y-1.5">
          <label className="label block">What the world needs</label>
          <textarea
            className={textareaClass}
            placeholder="Problems you notice, gaps you could fill…"
            value={worldNeeds}
            onChange={(e) => setWorldNeeds(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="label block">What you can be paid for</label>
          <textarea
            className={textareaClass}
            placeholder="Ways people or organisations might value your contribution…"
            value={paidFor}
            onChange={(e) => setPaidFor(e.target.value)}
          />
        </div>
      </div>

      {/* Action area — gated behind sign-in */}
      {isLoaded && !isSignedIn ? (
        <div className="card space-y-3 p-6 text-center">
          <p className="text-ink-soft">
            Sign in to find and save your Ikigai analysis.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-lg bg-sage px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-dark transition-colors">
              Sign in to continue
            </button>
          </SignInButton>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button onClick={findIkigai} disabled={!canSubmit || loading}>
            {loading ? "Finding your Ikigai…" : "Find my Ikigai"}
          </Button>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-warm-light px-4 py-3 text-sm text-warm-dark">
          {error}
        </p>
      )}

      {analysis && (
        <section className="panel-accent space-y-3 rounded-r-lg p-5">
          <p className="label">Your Ikigai</p>
          <p className="font-serif text-lg leading-relaxed text-sage-dark">
            {analysis}
          </p>
        </section>
      )}
    </div>
  );
}
