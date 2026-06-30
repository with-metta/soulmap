import { vi } from "vitest";
import { NextRequest } from "next/server";

// Mock the Anthropic client to return a valid parsed_output.
vi.mock("@/lib/ai/client", () => {
  return {
    getClient: () => ({
      messages: {
        parse: async () => ({
          parsed_output: {
            themes: [
              { label: "fear of not being enough", count: 3 },
              { label: "longing for deeper connection", count: 2 },
              { label: "tension between freedom and responsibility", count: 1 },
            ],
          },
        }),
      },
    }),
    MODEL: "claude-sonnet-4-6",
  };
});

import { POST } from "@/app/api/themes/route";

describe("POST /api/themes (happy path)", () => {
  it("returns normalized themes when the model provides parsed_output", async () => {
    const body = {
      entries: [
        { body: "I feel like I am never enough", promptCategory: "mood", createdAt: 1 },
        { body: "I wish I had closer relationships", promptCategory: "relationships", createdAt: 2 },
        { body: "I want freedom but also responsibility scares me", promptCategory: "values", createdAt: 3 },
      ],
    };

    const req = new Request("http://localhost/api/themes", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req as unknown as Request);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveProperty("themes");
    expect(Array.isArray(json.themes)).toBe(true);
    expect(json.themes[0].label).toBe("fear of not being enough");
    expect(Number.isInteger(json.themes[0].count)).toBe(true);
  });
});
