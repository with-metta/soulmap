import { neon } from "@neondatabase/serverless";
import type { JournalEntry, LetterEntry, ValuesProfile } from "./types";

function sql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  return neon(process.env.DATABASE_URL);
}

async function ensureSchema() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      mood TEXT,
      prompt_category TEXT NOT NULL,
      prompt_text TEXT NOT NULL,
      body TEXT NOT NULL,
      reflection_text TEXT,
      reflection_question TEXT
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS value_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      value_ids TEXT NOT NULL,
      profile_text TEXT NOT NULL
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS letters (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      unlock_at BIGINT NOT NULL,
      body TEXT NOT NULL
    )
  `;
  await db`CREATE INDEX IF NOT EXISTS entries_user_created ON entries(user_id, created_at DESC)`;
  await db`CREATE INDEX IF NOT EXISTS profiles_user_created ON value_profiles(user_id, created_at DESC)`;
  await db`CREATE INDEX IF NOT EXISTS letters_user_created ON letters(user_id, created_at DESC)`;
}

export async function saveEntry(userId: string, entry: JournalEntry): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`
    INSERT INTO entries (id, user_id, created_at, mood, prompt_category, prompt_text, body, reflection_text, reflection_question)
    VALUES (
      ${entry.id}, ${userId}, ${entry.createdAt}, ${entry.mood ?? null},
      ${entry.promptCategory}, ${entry.promptText}, ${entry.body},
      ${entry.reflection?.reflection ?? null}, ${entry.reflection?.question ?? null}
    )
    ON CONFLICT (id) DO UPDATE SET
      reflection_text = EXCLUDED.reflection_text,
      reflection_question = EXCLUDED.reflection_question
  `;
}

export async function getEntries(userId: string, limit = 50): Promise<JournalEntry[]> {
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT * FROM entries WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: r.id as string,
    createdAt: Number(r.created_at),
    mood: (r.mood as JournalEntry["mood"]) ?? null,
    promptCategory: r.prompt_category as JournalEntry["promptCategory"],
    promptText: r.prompt_text as string,
    body: r.body as string,
    ...(r.reflection_text && r.reflection_question
      ? { reflection: { reflection: r.reflection_text as string, question: r.reflection_question as string } }
      : {}),
  }));
}

export async function saveProfile(userId: string, profile: ValuesProfile): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`
    INSERT INTO value_profiles (id, user_id, created_at, value_ids, profile_text)
    VALUES (${profile.id}, ${userId}, ${profile.createdAt}, ${JSON.stringify(profile.valueIds)}, ${profile.profileText})
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function getLatestProfile(userId: string): Promise<ValuesProfile | null> {
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT * FROM value_profiles WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT 1
  `;
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id as string,
    createdAt: Number(r.created_at),
    valueIds: JSON.parse(r.value_ids as string) as string[],
    profileText: r.profile_text as string,
  };
}

export async function saveLetter(userId: string, entry: LetterEntry): Promise<void> {
  await ensureSchema();
  const db = sql();
  await db`
    INSERT INTO letters (id, user_id, created_at, unlock_at, body)
    VALUES (${entry.id}, ${userId}, ${entry.createdAt}, ${entry.unlockAt}, ${entry.body})
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function getLetters(userId: string, limit = 50): Promise<LetterEntry[]> {
  await ensureSchema();
  const db = sql();
  const rows = await db`
    SELECT * FROM letters WHERE user_id = ${userId}
    ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: r.id as string,
    createdAt: Number(r.created_at),
    unlockAt: Number(r.unlock_at),
    body: r.body as string,
  }));
}
