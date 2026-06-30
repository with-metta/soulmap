import { NextResponse } from "next/server";
import { z } from "zod";
import { getClient, MODEL } from "@/lib/ai/client";
import { IKIGAI_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { errorBody, errorStatus } from "@/lib/ai/errors";

// POST /api/ikigai — ikigai analysis (REQ-N2).
// Body: { love, goodAt, worldNeeds, paidFor }  (all plain text, 1–2000 chars)
// Returns: { analysis: string }  (plain text)

const field = z.string().min(1).max(2000);

const RequestSchema = z.object({
  love: field,
  goodAt: field,
  worldNeeds: field,
  paidFor: field,
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      {
        error:
          "Expected `love`, `goodAt`, `worldNeeds`, and `paidFor` — each a non-empty string up to 2000 characters.",
      },
      { status: 400 },
    );
  }

  try {
    const client = getClient();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: IKIGAI_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            `What I love: ${parsed.love}`,
            `What I'm good at: ${parsed.goodAt}`,
            `What the world needs: ${parsed.worldNeeds}`,
            `What I can be paid for: ${parsed.paidFor}`,
          ].join("\n"),
        },
      ],
    });

    const analysis = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!analysis) {
      return NextResponse.json(
        { error: "The analysis could not be generated. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ analysis });
  } catch (err) {
    return NextResponse.json(errorBody(err), { status: errorStatus(err) });
  }
}
