import { POST } from "@/app/api/themes/route";

// This path is rejected by RequestSchema before getClient() is ever called,
// so no Anthropic client mocking is needed here (see themes.happy.test.ts
// for the mocked happy-path test).
describe("POST /api/themes (validation)", () => {
  it("rejects fewer than 3 entries with a 400 and an error field", async () => {
    const body = {
      entries: [{ body: "a", promptCategory: "x", createdAt: 1 }],
    };

    const req = new Request("http://localhost/api/themes", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req as unknown as Request);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBeTruthy();
  });
});
