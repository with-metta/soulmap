import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { JournalEntry, ValuesProfile } from "./types";

// Local-first persistence (ADR-002). All reads/writes go through this module
// so the UI never touches IndexedDB directly — a future Supabase backend can
// implement the same function surface. Browser-only: guarded against SSR.

interface SoulMapDB extends DBSchema {
  entries: {
    key: string;
    value: JournalEntry;
    indexes: { byCreatedAt: number };
  };
  profiles: {
    key: string;
    value: ValuesProfile;
    indexes: { byCreatedAt: number };
  };
}

const DB_NAME = "soulmap";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SoulMapDB>> | null = null;

function getDB(): Promise<IDBPDatabase<SoulMapDB>> {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is unavailable (this must run in the browser).");
  }
  if (!dbPromise) {
    dbPromise = openDB<SoulMapDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const entries = db.createObjectStore("entries", { keyPath: "id" });
        entries.createIndex("byCreatedAt", "createdAt");
        const profiles = db.createObjectStore("profiles", { keyPath: "id" });
        profiles.createIndex("byCreatedAt", "createdAt");
      },
    });
  }
  return dbPromise;
}

/** Crypto-random id; falls back for older browsers. */
export function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

// ── Journal entries ──────────────────────────────────────────────────────

export async function saveEntry(entry: JournalEntry): Promise<void> {
  const db = await getDB();
  await db.put("entries", entry);
}

/** All entries, newest first. */
export async function getEntries(): Promise<JournalEntry[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("entries", "byCreatedAt");
  return all.reverse();
}

export async function getRecentEntries(limit: number): Promise<JournalEntry[]> {
  return (await getEntries()).slice(0, limit);
}

// ── Values profiles ──────────────────────────────────────────────────────

export async function saveProfile(profile: ValuesProfile): Promise<void> {
  const db = await getDB();
  await db.put("profiles", profile);
}

export async function getLatestProfile(): Promise<ValuesProfile | null> {
  const db = await getDB();
  const all = await db.getAllFromIndex("profiles", "byCreatedAt");
  return all.length ? all[all.length - 1] : null;
}

// ── Streak (REQ-NAV1) ──────────────────────────────────────────────────────

/** Local-date key (YYYY-MM-DD) for grouping entries by calendar day. */
function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * Consecutive-day journaling streak, counting back from today. Today not yet
 * journaled doesn't break a streak that ran through yesterday.
 */
export async function getStreak(entries?: JournalEntry[]): Promise<number> {
  const list = entries ?? (await getEntries());
  if (list.length === 0) return 0;

  const days = new Set(list.map((e) => dayKey(e.createdAt)));

  const cursor = new Date();
  // If today has no entry, anchor the streak on yesterday instead.
  if (!days.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
