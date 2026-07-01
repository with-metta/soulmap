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
  const [prefilling, setPrefilling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      .catch(() => {})
      .finally(() => {
        setPrefilling(false);
      });
  }, []);

  const canSubmit = love.trim() && goodAt.trim() && worldNeeds.trim() && paidFor.trim();
  const MAX_CHARS = 2000;

  async function findIkigai() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const res = await fetch("/api/ikigai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ love, goodAt, worldNeeds, paidFor }),
        signal: controller.signal,
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
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  const textareaClass =
    "font-serif w-full resize-none rounded-xl border border-black/8 bg-white/60 p-4 h-32 text-ink focus:outline-none focus:border-sage";

  const renderField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder: string
  ) => (
    <div className="space-y-1.5">
      <label className="label block">{label}</label>
      <textarea
        className={textareaClass}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        disabled={prefilling}
      />
      <div className="text-xs text-ink-soft">
        {value.length} / {MAX_CHARS}
      </div>
    </div>
  );

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

      {prefilling ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-ink-soft">Loading your previous entry…</p>
        </div>
      ) : (
        <>
          {/* 2×2 grid with centered label between rows */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Row 1 */}
            {renderField(
              "What you love",
              love,
              setLove,
              "Things that energise and absorb you…"
            )}

            {renderField(
              "What you're good at",
              goodAt,
              setGoodAt,
              "Skills, talents, natural strengths…"
            )}

            {/* Centre label spanning full width */}
            <p className="label text-center col-span-1 sm:col-span-2">
              Ikigai
            </p>

            {/* Row 2 */}
            {renderField(
              "What the world needs",
              worldNeeds,
              setWorldNeeds,
              "Problems you notice, gaps you could fill…"
            )}

            {renderField(
              "What you can be paid for",
              paidFor,
              setPaidFor,
              "Ways people or organisations might value your contribution…"
            )}
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

          {success && (
            <p className="rounded-lg bg-sage-light px-4 py-3 text-sm text-sage-dark animate-pulse">
              ✓ Saved successfully
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
        </>
      )}
    </div>
  );
}
