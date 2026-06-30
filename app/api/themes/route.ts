import { NextResponse } from "next/server";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClient, MODEL } from "@/lib/ai/client";
import { THEMES_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { errorBody, errorStatus } from "@/lib/ai/errors";

// POST /api/themes — AI-extracted recurring themes (REQ-N8).
// Body: { entries: Array<{ body: string; promptCategory: string; createdAt: number }> }
// Requires ≥ 3 entries. Returns: { themes: Array<{ label: string; count: number }> }

const EntrySchema = z.object({
  body: z.string().min(1).max(5000),
  promptCategory: z.string(),
  createdAt: z.number(),
});

const RequestSchema = z.object({
  entries: z.array(EntrySchema).min(3),
});

// Structured-output schema: 3–6 specific, emotionally resonant themes.
const ThemesSchema = z.object({
  themes: z
    .array(z.object({ label: z.string(), count: z.number().int() }))
    .min(3)
    .max(6),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      {
        error:
          "Expected at least 3 entries, each with a body (max 5 000 chars).",
      },
      { status: 400 },
    );
  }

  try {
    const client = getClient();

    // Concatenate entries into a single readable block for the model.
    const userContent = parsed.entries
      .map(
        (e, i) =>
          `Entry ${i + 1} [${e.promptCategory}]:\n${e.body}`,
      )
      .join("\n\n---\n\n");

    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "disabled" },
      // Low-effort keeps latency and cost down, matching the calm UX.
      output_config: {
        effort: "low",
        format: zodOutputFormat(ThemesSchema),
      },
      // Cache breakpoint placed correctly; won't engage at current prompt
      // size — see ADR-004 caveat in lib/ai/client.ts.
      system: [
        {
          type: "text",
          text: THEMES_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "The themes could not be extracted. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json(response.parsed_output);
  } catch (err) {
    return NextResponse.json(errorBody(err), { status: errorStatus(err) });
  }
}
