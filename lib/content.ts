import type { Mood, Prompt, ValueDef } from "./types";

// Static content for the app's frameworks (REQ-J1, REQ-J2, REQ-V1).
// Editing copy here propagates everywhere; nothing below is user data.

export const MOODS: Mood[] = [
  { id: "calm", label: "Calm" },
  { id: "heavy", label: "Heavy" },
  { id: "curious", label: "Curious" },
  { id: "frustrated", label: "Frustrated" },
  { id: "hopeful", label: "Hopeful" },
  { id: "numb", label: "Numb" },
];

export const PROMPTS: Prompt[] = [
  {
    category: "avoidance",
    label: "Avoidance",
    text: "What is something you keep postponing — and what does that avoidance tell you?",
  },
  {
    category: "identity",
    label: "Identity",
    text: "Who were you before the world told you who to be?",
  },
  {
    category: "relationships",
    label: "Relationships",
    text: "Which of your relationships feel like home, and which feel like performance?",
  },
  {
    category: "purpose",
    label: "Purpose",
    text: "If your life had a purpose it hasn't fulfilled yet, what would it be?",
  },
  {
    category: "fear",
    label: "Fear",
    text: "What is a fear that has quietly shaped more decisions than you'd like to admit?",
  },
];

export const AFFIRMATIONS: string[] = [
  "You do not have to have it all figured out to be worthy of your own attention.",
  "Small, honest moments add up to a life.",
  "Rest is not a departure from the path — it is part of it.",
  "You are allowed to change your mind about who you're becoming.",
  "Noticing is itself a kind of progress.",
  "You don't need permission to want what you want.",
  "Some days the only task is to stay soft.",
  "Whatever you're carrying, you don't have to carry it alone.",
  "The quiet in-between moments are where you meet yourself.",
  "You are not behind. There is no schedule but your own.",
  "Being gentle with yourself is not the same as giving up.",
  "You get to define what a good day looks like.",
];

export const VALUES: ValueDef[] = [
  { id: "creativity", name: "Creativity", description: "Making something new from what is" },
  { id: "freedom", name: "Freedom", description: "Room to choose your own way" },
  { id: "connection", name: "Connection", description: "Being truly known by others" },
  { id: "purpose", name: "Purpose", description: "Work that means something" },
  { id: "growth", name: "Growth", description: "Becoming more than you were" },
  { id: "honesty", name: "Honesty", description: "Living without pretense" },
  { id: "security", name: "Security", description: "Stable ground to stand on" },
  { id: "adventure", name: "Adventure", description: "Seeking the unfamiliar" },
  { id: "solitude", name: "Solitude", description: "Time alone to hear yourself" },
  { id: "service", name: "Service", description: "Giving more than you take" },
  { id: "excellence", name: "Excellence", description: "Doing things truly well" },
  { id: "play", name: "Play", description: "Joy without a purpose" },
  { id: "depth", name: "Depth", description: "Going beneath the surface" },
  { id: "courage", name: "Courage", description: "Acting in spite of fear" },
  { id: "balance", name: "Balance", description: "Holding the whole life lightly" },
  { id: "recognition", name: "Recognition", description: "Being seen for what you do" },
];

/** Max values a user may select in the survey (REQ-V2). */
export const MAX_VALUE_SELECTION = 7;
/** Minimum selections before the profile unlocks (REQ-V3). */
export const MIN_VALUE_SELECTION = 3;

/** Helper: look up a prompt by its category (used for deep-links from Insights). */
export function promptByCategory(category: string): Prompt | undefined {
  return PROMPTS.find((p) => p.category === category);
}

export function valueById(id: string): ValueDef | undefined {
  return VALUES.find((v) => v.id === id);
}
