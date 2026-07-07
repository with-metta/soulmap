import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEntries, saveEntry } from "@/lib/db-server";
import type { JournalEntry } from "@/lib/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const entries = await getEntries(userId, 50);
    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json({ error: "Could not load cloud entries." }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const entry = (await req.json()) as JournalEntry;
  try {
    await saveEntry(userId, entry);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save to the cloud." }, { status: 502 });
  }
}
