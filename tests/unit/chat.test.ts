import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { handler } from "../../netlify/functions/chat"

const userMsg = (text: string) => ({ role: "user", parts: [{ text }] })
const post = (body: unknown) => handler({ httpMethod: "POST", body: JSON.stringify(body) })

function mockGemini(response: Response) {
  const fetchMock = vi.fn(async () => response)
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

describe("chat function", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-key")
    vi.spyOn(console, "error").mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it("only accepts POST", async () => {
    expect((await handler({ httpMethod: "GET", body: null })).statusCode).toBe(405)
  })

  it("returns 500 when the API key is missing", async () => {
    vi.stubEnv("GEMINI_API_KEY", "")
    expect((await post({ messages: [userMsg("hi")] })).statusCode).toBe(500)
  })

  it.each([
    ["invalid JSON", "{not json"],
    ["no messages", JSON.stringify({ messages: [] })],
    ["last message not from the user", JSON.stringify({ messages: [{ role: "model", parts: [{ text: "hi" }] }] })],
    ["empty text", JSON.stringify({ messages: [userMsg("   ")] })],
    ["text over 500 characters", JSON.stringify({ messages: [userMsg("x".repeat(501))] })],
  ])("rejects %s with 400", async (_name, body) => {
    const fetchMock = mockGemini(Response.json({}))
    const res = await handler({ httpMethod: "POST", body })
    expect(res.statusCode).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("returns the model reply", async () => {
    mockGemini(Response.json({ candidates: [{ content: { parts: [{ text: "Akshat is based in Los Angeles." }] } }] }))
    const res = await post({ messages: [userMsg("Where is Akshat based?")] })
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).reply).toBe("Akshat is based in Los Angeles.")
  })

  it("sends only the last 6 messages and the portfolio system prompt", async () => {
    const fetchMock = mockGemini(Response.json({ candidates: [{ content: { parts: [{ text: "ok" }] } }] }))
    const history = Array.from({ length: 9 }, (_, i) =>
      i % 2 === 0 ? userMsg(`q${i}`) : { role: "model", parts: [{ text: `a${i}` }] }
    )
    await post({ messages: history })
    const sent = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string)
    expect(sent.contents).toHaveLength(6)
    expect(sent.contents.at(-1).parts[0].text).toBe("q8")
    expect(sent.system_instruction.parts[0].text).toContain("Los Angeles")
  })

  it("maps an upstream failure to 502", async () => {
    mockGemini(new Response("quota exceeded", { status: 429 }))
    expect((await post({ messages: [userMsg("hi")] })).statusCode).toBe(502)
  })

  it("falls back to a friendly message when the model returns nothing", async () => {
    mockGemini(Response.json({ candidates: [] }))
    const res = await post({ messages: [userMsg("hi")] })
    expect(res.statusCode).toBe(200)
    expect(JSON.parse(res.body).reply).toMatch(/couldn't generate/i)
  })

  it("returns 500 when the network call throws", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down") }))
    expect((await post({ messages: [userMsg("hi")] })).statusCode).toBe(500)
  })
})
