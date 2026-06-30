import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLatestProfile, saveProfile } from "@/lib/db-server";
import type { ValuesProfile } from "@/lib/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getLatestProfile(userId);
  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = (await req.json()) as ValuesProfile;
  await saveProfile(userId, profile);
  return NextResponse.json({ ok: true });
}
