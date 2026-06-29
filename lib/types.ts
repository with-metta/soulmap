// Shared domain types for SoulMap. Kept storage-agnostic so the persistence
// backend (currently IndexedDB) can change without touching the UI — see
// docs/DECISIONS.md ADR-002.

export type MoodId =
  | "calm"
  | "heavy"
  | "curious"
  | "frustrated"
  | "hopeful"
  | "numb";

export type PromptCategory =
  | "avoidance"
  | "identity"
  | "relationships"
  | "purpose"
  | "fear";

export interface Mood {
  id: MoodId;
  label: string;
}

export interface Prompt {
  category: PromptCategory;
  label: string;
  text: string;
}

export interface ValueDef {
  id: string;
  name: string;
  description: string;
}

/** A saved journal entry. `createdAt` is an epoch-ms timestamp. */
export interface JournalEntry {
  id: string;
  createdAt: number;
  mood: MoodId | null;
  promptCategory: PromptCategory;
  promptText: string;
  body: string;
  reflection?: AIReflection;
}

/** The structured response from the journal reflection route. */
export interface AIReflection {
  reflection: string;
  question: string;
}

/** A saved values-survey result. */
export interface ValuesProfile {
  id: string;
  createdAt: number;
  valueIds: string[];
  profileText: string;
}
