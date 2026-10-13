import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { OpenSourceData } from "@/lib/openSource"

const pr = (repo: string, n: number, state: "open" | "closed", mergedAt: string | null = null) => ({
  title: `PR ${n} in ${repo}`,
  html_url: `https://github.com/${repo}/pull/${n}`,
  state,
  created_at: "2026-10-01T00:00:00Z",
  repository_url: `https://api.github.com/repos/${repo}`,
  pull_request: { merged_at: mergedAt },
})

const SEARCH_ITEMS = [
  pr("microsoft/PyRIT", 1, "closed", "2026-10-09T00:00:00Z"),
  pr("BerriAI/litellm", 2, "open"),
  pr("langchain-ai/langchain", 3, "closed"), // closed without merging
  pr("Suthar-Naresh/brief-bytes", 4, "closed", "2024-09-15T00:00:00Z"), // team repo, excluded
  pr("reticlehq/reticle", 1399, "closed"), // shipped through a release branch
]

function mockGitHub({ fail = false } = {}) {
  const fetchMock = vi.fn(async (url: string, _init?: RequestInit) => {
    if (fail) return new Response("rate limited", { status: 403 })
    if (url.includes("/search/issues")) return Response.json({ items: SEARCH_ITEMS })
    if (url.includes("/search/repositories"))
      return Response.json({
        items: [
          { full_name: "Microsoft/PyRIT", stargazers_count: 4605 },
          { full_name: "reticlehq/reticle", stargazers_count: 1215 },
        ],
      })
    return new Response("not found", { status: 404 })
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

async function load() {
  vi.resetModules()
  return import("@/lib/openSource")
}

describe("fetchContributions", () => {
  beforeEach(() => {
    vi.stubEnv("GITHUB_TOKEN", "")
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it("keeps merged and open PRs, drops closed-unmerged and excluded team repos", async () => {
    mockGitHub()
    const { fetchContributions } = await load()
    const { contributions } = await fetchContributions()
    const repos = contributions.map((c) => c.repo)
    expect(repos).toContain("microsoft/PyRIT")
    expect(repos).toContain("BerriAI/litellm")
    expect(repos).not.toContain("langchain-ai/langchain")
    expect(repos).not.toContain("Suthar-Naresh/brief-bytes")
  })

  it("dates merged PRs by merge time and open PRs by creation time", async () => {
    mockGitHub()
    const { fetchContributions } = await load()
    const { contributions } = await fetchContributions()
    expect(contributions.find((c) => c.repo === "microsoft/PyRIT")).toMatchObject({ state: "merged", date: "2026-10-09T00:00:00Z" })
    expect(contributions.find((c) => c.repo === "BerriAI/litellm")).toMatchObject({ state: "open", date: "2026-10-01T00:00:00Z" })
  })

  it("counts a PR shipped through a release branch as shipped", async () => {
    mockGitHub()
    const { fetchContributions } = await load()
    const { contributions } = await fetchContributions()
    expect(contributions.find((c) => c.url.endsWith("/pull/1399"))).toMatchObject({ state: "merged", shippedIn: "v3.6.0" })
  })

  it("attaches star counts case-insensitively and leaves unknown ones undefined", async () => {
    mockGitHub()
    const { fetchContributions } = await load()
    const { contributions } = await fetchContributions()
    expect(contributions.find((c) => c.repo === "microsoft/PyRIT")?.stars).toBe(4605)
    expect(contributions.find((c) => c.repo === "BerriAI/litellm")?.stars).toBeUndefined()
  })

  it("sends the token when one is configured", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token")
    const fetchMock = mockGitHub()
    const { fetchContributions } = await load()
    await fetchContributions()
    const init = fetchMock.mock.calls[0][1] ?? {}
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-token")
  })
})

describe("getContributions", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("falls back to the snapshot when GitHub is unavailable", async () => {
    mockGitHub({ fail: true })
    vi.spyOn(console, "warn").mockImplementation(() => {})
    const { getContributions } = await load()
    const fallback: OpenSourceData = { contributions: [], fetchedAt: "snapshot" }
    await expect(getContributions(fallback)).resolves.toBe(fallback)
  })

  it("fetches once per build even when several components ask", async () => {
    const fetchMock = mockGitHub()
    const { getContributions } = await load()
    const fallback: OpenSourceData = { contributions: [], fetchedAt: "snapshot" }
    const [a, b] = await Promise.all([getContributions(fallback), getContributions(fallback)])
    expect(a).toBe(b)
    expect(fetchMock.mock.calls.filter(([url]) => String(url).includes("/search/issues"))).toHaveLength(1)
  })
})
