import { NextResponse } from "next/server";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getClient, MODEL } from "@/lib/ai/client";
import { JOURNAL_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { errorBody, errorStatus } from "@/lib/ai/errors";

// POST /api/reflect — journal reflection (REQ-J3).
// Body: { prompt: string, entry: string }
// Returns: { reflection: string, question: string }

const RequestSchema = z.object({
  prompt: z.string().min(1),
  entry: z.string().min(1).max(20_000),
});

// Structured-output schema: guarantees the model returns exactly this shape,
// so we never hand-parse JSON out of free text.
const ReflectionSchema = z.object({
  reflection: z.string(),
  question: z.string(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Expected a non-empty `prompt` and `entry`." },
      { status: 400 },
    );
  }

  try {
    const client = getClient();
    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "disabled" },
      // Short, calm reflections — low effort keeps latency and cost down.
      output_config: {
        effort: "low",
        format: zodOutputFormat(ReflectionSchema),
      },
      // System as an array with a cache breakpoint (see ADR-004 caveat in
      // lib/ai/client.ts — won't engage at current prompt size).
      system: [
        {
          type: "text",
          text: JOURNAL_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Prompt: "${parsed.prompt}"\nEntry: "${parsed.entry}"`,
        },
      ],
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "The reflection could not be generated. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json(response.parsed_output);
  } catch (err) {
    return NextResponse.json(errorBody(err), { status: errorStatus(err) });
  }
}
