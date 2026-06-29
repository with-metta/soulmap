import { NextResponse } from "next/server";
import { z } from "zod";
import { getClient, MODEL } from "@/lib/ai/client";
import { VALUES_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { errorBody, errorStatus } from "@/lib/ai/errors";

// POST /api/values — values profile (REQ-V4).
// Body: { values: string[] }  (display names, e.g. ["Creativity", "Depth"])
// Returns: { profile: string }  (plain text)

const RequestSchema = z.object({
  values: z.array(z.string().min(1)).min(3).max(7),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Expected `values` to be a list of 3–7 value names." },
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
          text: VALUES_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `My chosen values: ${parsed.values.join(", ")}`,
        },
      ],
    });

    const profile = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!profile) {
      return NextResponse.json(
        { error: "The profile could not be generated. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json(errorBody(err), { status: errorStatus(err) });
  }
}
