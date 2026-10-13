import { describe, expect, it, vi } from "vitest"
import { config, REBUILD_TITLE, triggerRebuild } from "../../netlify/functions/daily-rebuild.mts"

const HOOK = "https://api.netlify.com/build_hooks/test-hook-id"

describe("daily rebuild function", () => {
  it("runs once a day", () => {
    expect(config.schedule).toBe("0 13 * * *")
  })

  it("POSTs to the build hook with a readable deploy title", async () => {
    const fetchMock = vi.fn(async (_url: URL, _init?: RequestInit) => new Response(null, { status: 200 }))
    await expect(triggerRebuild(HOOK, fetchMock as unknown as typeof fetch)).resolves.toEqual({ triggered: true })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url.origin + url.pathname).toBe(HOOK)
    expect(url.searchParams.get("trigger_title")).toBe(REBUILD_TITLE)
    expect(init?.method).toBe("POST")
  })

  it("does nothing when the hook is not configured", async () => {
    const fetchMock = vi.fn()
    vi.spyOn(console, "warn").mockImplementation(() => {})
    await expect(triggerRebuild(undefined, fetchMock as unknown as typeof fetch)).resolves.toEqual({
      triggered: false,
      reason: "missing-hook",
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("fails loudly when Netlify rejects the hook, so the error shows in the function log", async () => {
    const fetchMock = vi.fn(async () => new Response("not found", { status: 404 }))
    await expect(triggerRebuild(HOOK, fetchMock as unknown as typeof fetch)).rejects.toThrow("404")
  })
})
