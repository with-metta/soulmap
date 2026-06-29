"use client";

import { useState } from "react";
import {
  MAX_VALUE_SELECTION,
  MIN_VALUE_SELECTION,
  VALUES,
  valueById,
} from "@/lib/content";
import { newId, saveProfile } from "@/lib/db";
import { Button } from "@/components/Button";

export default function ValuesPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = selected.length >= MIN_VALUE_SELECTION;

  function toggle(id: string) {
    setProfile(null);
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= MAX_VALUE_SELECTION) return prev; // cap at 7
      return [...prev, id];
    });
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const names = selected.map((id) => valueById(id)?.name ?? id);
      const res = await fetch("/api/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: names }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      setProfile(data.profile);
      await saveProfile({
        id: newId(),
        createdAt: Date.now(),
        valueIds: [...selected],
        profileText: data.profile,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="label">Values</p>
        <h1 className="heading text-3xl">What truly matters to you?</h1>
        <p className="mt-2 text-ink-soft">
          Choose the {MAX_VALUE_SELECTION} that feel most alive — not the ones
          you think you should pick.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {VALUES.map((v) => {
          const isOn = selected.includes(v.id);
          return (
            <button
              key={v.id}
              onClick={() => toggle(v.id)}
              className={`card p-4 text-left transition-colors ${
                isOn ? "border-warm bg-warm-light" : "hover:border-black/20"
              }`}
            >
              <p
                className={`font-medium ${isOn ? "text-warm-dark" : "text-ink"}`}
              >
                {v.name}
              </p>
              <p className="text-sm text-ink-muted">{v.description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="label">
          {selected.length} / {MAX_VALUE_SELECTION} chosen
        </span>
        <Button onClick={generate} disabled={!canSubmit || loading}>
          {loading
            ? "Reading your values…"
            : canSubmit
              ? "See my values profile"
              : `Choose ${MIN_VALUE_SELECTION - selected.length} more`}
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-warm-light px-4 py-3 text-sm text-warm-dark">
          {error}
        </p>
      )}

      {profile && (
        <section className="panel-accent space-y-3 rounded-r-lg p-5">
          <p className="label">Your values profile</p>
          <p className="font-serif text-lg leading-relaxed text-sage-dark">
            {profile}
          </p>
        </section>
      )}
    </div>
  );
}
