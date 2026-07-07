import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLetters, saveLetter } from "@/lib/db-server";
import type { LetterEntry } from "@/lib/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const letters = await getLetters(userId, 50);
  return NextResponse.json({ letters });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entry = (await req.json()) as LetterEntry;
  await saveLetter(userId, entry);
  return NextResponse.json({ ok: true });
}
