"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { newId, saveLetter, getLetters } from "@/lib/db";
import type { LetterEntry } from "@/lib/types";
import { Button } from "@/components/Button";

const textareaClass =
  "font-serif w-full resize-y rounded-xl border border-black/8 bg-white/60 p-4 h-40 text-ink outline-none focus:border-sage";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Today's date as a YYYY-MM-DD string, for the min attribute on the date input. */
function todayDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Whether a given timestamp is still in the future, relative to now. */
function isFuture(ts: number | null): boolean {
  return ts !== null && ts > Date.now();
}

/** Whether a letter is still sealed, relative to now. */
function isSealed(letter: LetterEntry): boolean {
  return Date.now() < letter.unlockAt;
}

export default function LetterPage() {
  const { isSignedIn, isLoaded } = useUser();

  const [body, setBody] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [letters, setLetters] = useState<LetterEntry[] | null>(null);

  useEffect(() => {
    // Local-first: load from IndexedDB immediately, don't block on cloud (ADR-002).
    getLetters()
      .then(setLetters)
      .catch(() => setLetters([]));
  }, []);

  const min = todayDateString();
  const unlockTimestamp = unlockDate ? new Date(`${unlockDate}T00:00:00`).getTime() : null;
  const isFutureDate = isFuture(unlockTimestamp);
  const dateError = unlockDate.length > 0 && !isFutureDate;
  const canSubmit = body.trim().length > 0 && isFutureDate;

  async function submitLetter() {
    if (!canSubmit || unlockTimestamp === null) return;
    setSaving(true);
    setSuccess(false);

    const entry: LetterEntry = {
      id: newId(),
      createdAt: Date.now(),
      unlockAt: unlockTimestamp,
      body,
    };

    try {
      // Local IndexedDB save (offline fallback).
      await saveLetter(entry);

      // Cloud save (fire-and-forget).
      fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      }).catch(() => {});

      setLetters((prev) => [entry, ...(prev ?? [])]);
      setBody("");
      setUnlockDate("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="label">Letter</p>
        <h1 className="heading text-3xl">Write to your future self</h1>
        <p className="mt-2 text-ink-soft">
          Seal a letter for a version of you that hasn&apos;t arrived yet. It
          stays hidden until the date you choose.
        </p>
      </div>

      {isLoaded && !isSignedIn ? (
        <section className="card space-y-3 p-6 text-center">
          <p className="text-ink-soft">
            Sign in to write and save a letter to your future self.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-lg bg-sage px-5 py-2.5 text-sm font-medium text-white hover:bg-sage-dark transition-colors">
              Sign in to continue
            </button>
          </SignInButton>
        </section>
      ) : (
        <section className="space-y-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Dear future me…"
            className={textareaClass}
          />
          <div className="space-y-1.5">
            <label className="label block" htmlFor="unlock-date">
              Unlock date
            </label>
            <input
              id="unlock-date"
              type="date"
              min={min}
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="rounded-lg border border-black/15 bg-white/60 px-3 py-2 text-sm text-ink outline-none focus:border-sage"
            />
            {dateError && (
              <p className="text-xs text-warm-dark">
                Choose a date after today — the letter needs somewhere to travel to.
              </p>
            )}
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={submitLetter} disabled={!canSubmit || saving}>
              {saving ? "Sealing…" : "Seal letter"}
            </Button>
          </div>
        </section>
      )}

      {success && (
        <p className="rounded-lg bg-sage-light px-4 py-3 text-sm text-sage-dark animate-pulse">
          ✓ Letter sealed
        </p>
      )}

      <section className="space-y-3">
        <p className="label">Your letters</p>
        {letters === null ? (
          <p className="text-ink-muted">Loading…</p>
        ) : letters.length === 0 ? (
          <p className="text-ink-soft">No letters yet. Write one above.</p>
        ) : (
          <ul className="space-y-3">
            {letters.map((letter) => {
              const sealed = isSealed(letter);
              return (
                <li key={letter.id} className="card p-4">
                  <p className="label">
                    Written {formatDate(letter.createdAt)}
                  </p>
                  {sealed ? (
                    <p className="mt-1 font-serif text-ink-soft italic">
                      Sealed until {formatDate(letter.unlockAt)}
                    </p>
                  ) : (
                    <p className="mt-1 whitespace-pre-wrap font-serif text-ink">
                      {letter.body}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
