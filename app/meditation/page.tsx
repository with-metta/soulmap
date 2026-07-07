"use client";

import { useEffect, useRef, useState } from "react";
import { newId, saveMeditationSession, getMeditationSessions } from "@/lib/db";
import { Button } from "@/components/Button";

// Preset session lengths, in minutes.
const DURATIONS = [1, 3, 5, 10];

// Box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s.
const PHASE_SECONDS = 4;
const PHASES = [
  { label: "Breathe in…", scale: 1.15 },
  { label: "Hold…", scale: 1.15 },
  { label: "Breathe out…", scale: 0.85 },
  { label: "Hold…", scale: 0.85 },
] as const;

type Status = "idle" | "running" | "paused" | "done";

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MeditationPage() {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [status, setStatus] = useState<Status>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionCount, setSessionCount] = useState<number | null>(null);

  const savedRef = useRef(false);

  const totalSeconds = selectedMinutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
  const locked = status === "running" || status === "paused";

  const phase = PHASES[Math.floor(elapsedSeconds / PHASE_SECONDS) % PHASES.length];

  // Load the local session count on mount.
  useEffect(() => {
    getMeditationSessions()
      .then((sessions) => setSessionCount(sessions.length))
      .catch(() => setSessionCount(0));
  }, []);

  // The single timing source: ticks once a second while running. Both the
  // countdown and the breathing phase are derived from `elapsedSeconds`, so
  // they can never drift apart. Completion is detected in the same tick
  // (not a separate effect reacting to state) so there's one source of
  // truth for "time's up". Cleanup always clears the interval — on unmount,
  // on pause, and on completion — so nothing keeps ticking in the
  // background.
  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) setStatus("done");
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [status, totalSeconds]);

  // Save a session record exactly once per completed run.
  useEffect(() => {
    if (status !== "done" || savedRef.current) return;
    savedRef.current = true;

    const session = { id: newId(), createdAt: Date.now(), durationSeconds: totalSeconds };
    saveMeditationSession(session)
      .then(() => setSessionCount((c) => (c ?? 0) + 1))
      .catch(() => {});
  }, [status, totalSeconds]);

  function selectDuration(minutes: number) {
    if (locked) return;
    setSelectedMinutes(minutes);
    setElapsedSeconds(0);
    setStatus("idle");
    savedRef.current = false;
  }

  function handleStart() {
    if (status === "done") {
      setElapsedSeconds(0);
      savedRef.current = false;
    }
    setStatus("running");
  }

  function handlePause() {
    setStatus("paused");
  }

  function handleReset() {
    setStatus("idle");
    setElapsedSeconds(0);
    savedRef.current = false;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="label">Meditation</p>
        <h1 className="heading text-3xl">A few quiet minutes to breathe</h1>
        <p className="mt-2 text-ink-soft">
          Pick a length, follow the circle, and let the rest settle on its own.
        </p>
      </div>

      {/* Duration picker */}
      <section className="space-y-3">
        <p className="label">Session length</p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((minutes) => (
            <Button
              key={minutes}
              variant={selectedMinutes === minutes ? "primary" : "secondary"}
              onClick={() => selectDuration(minutes)}
              disabled={locked}
            >
              {minutes} min
            </Button>
          ))}
        </div>
      </section>

      {/* Breathing guide */}
      <section className="flex flex-col items-center gap-5 py-6">
        <p className="label">{status === "done" ? "Session complete" : phase.label}</p>
        <div
          className="flex h-40 w-40 items-center justify-center rounded-full bg-sage-light transition-transform ease-in-out"
          style={{
            transform: `scale(${status === "done" ? 1 : phase.scale})`,
            transitionDuration: `${PHASE_SECONDS}s`,
          }}
        >
          <div className="h-24 w-24 rounded-full bg-sage/50" />
        </div>
        <p className="heading text-2xl tabular-nums">{formatTime(remainingSeconds)}</p>
      </section>

      {/* Timer controls */}
      <section className="flex justify-center gap-2">
        <Button onClick={handleStart} disabled={status === "running"}>
          {status === "paused" ? "Resume" : "Start"}
        </Button>
        <Button variant="secondary" onClick={handlePause} disabled={status !== "running"}>
          Pause
        </Button>
        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={status === "idle" && elapsedSeconds === 0}
        >
          Reset
        </Button>
      </section>

      {status === "done" && (
        <section className="panel-accent space-y-2 rounded-r-lg p-5 text-center">
          <p className="label">Well done</p>
          <p className="font-serif text-lg leading-relaxed text-sage-dark">
            Notice how you feel right now, before you move on with your day.
          </p>
        </section>
      )}

      {sessionCount !== null && sessionCount > 0 && (
        <p className="label text-center">
          {sessionCount} session{sessionCount === 1 ? "" : "s"} completed
        </p>
      )}
    </div>
  );
}
