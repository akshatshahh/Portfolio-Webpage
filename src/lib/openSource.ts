const AUTHOR = "akshatshahh"
// Team and coursework repos, not upstream open source.
const EXCLUDED_OWNERS = new Set(["suthar-naresh", "devasy"])
// Some maintainers land a PR through a release branch and close it instead of merging,
// so GitHub reports it as closed. These shipped anyway.
const SHIPPED_VIA_RELEASE: Record<string, string> = {
  "https://github.com/reticlehq/reticle/pull/1399": "v3.6.0",
}

export interface Contribution {
  title: string
  url: string
  repo: string
  owner: string
  state: "merged" | "open"
  /** Set when a closed PR shipped through a release branch instead of being merged */
  shippedIn?: string
  date: string
  stars?: number
}

export interface OpenSourceData {
  contributions: Contribution[]
  fetchedAt: string
}

interface SearchItem {
  title: string
  html_url: string
  state: string
  created_at: string
  repository_url: string
  pull_request?: { merged_at?: string | null }
}

function headers(): Record<string, string> {
  const token = import.meta.env?.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "akshatshah-portfolio",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json() as Promise<T>
}

export async function fetchContributions(): Promise<OpenSourceData> {
  const q = encodeURIComponent(`is:pr author:${AUTHOR} -user:${AUTHOR}`)
  const search = await getJson<{ items: SearchItem[] }>(
    `https://api.github.com/search/issues?q=${q}&per_page=100&sort=created&order=desc`
  )

  const contributions: Contribution[] = []
  for (const item of search.items) {
    const repo = item.repository_url.replace("https://api.github.com/repos/", "")
    const owner = repo.split("/")[0]
    if (EXCLUDED_OWNERS.has(owner.toLowerCase())) continue

    const mergedAt = item.pull_request?.merged_at
    const shippedIn = SHIPPED_VIA_RELEASE[item.html_url]
    if (shippedIn) {
      contributions.push({ title: item.title, url: item.html_url, repo, owner, state: "merged", shippedIn, date: item.created_at })
    } else if (item.state === "open") {
      contributions.push({ title: item.title, url: item.html_url, repo, owner, state: "open", date: item.created_at })
    } else if (mergedAt) {
      contributions.push({ title: item.title, url: item.html_url, repo, owner, state: "merged", date: mergedAt })
    }
  }

  // Batch star lookups through repo search; chunks keep each query under GitHub's length limit.
  const repos = [...new Set(contributions.map((c) => c.repo))]
  const stars = new Map<string, number>()
  for (let i = 0; i < repos.length; i += 6) {
    const query = encodeURIComponent(repos.slice(i, i + 6).map((r) => `repo:${r}`).join(" "))
    try {
      const res = await getJson<{ items: { full_name: string; stargazers_count: number }[] }>(
        `https://api.github.com/search/repositories?q=${query}&per_page=10`
      )
      for (const r of res.items) stars.set(r.full_name.toLowerCase(), r.stargazers_count)
    } catch {
      // Stars are decoration; a failed lookup just hides the count.
    }
  }
  for (const c of contributions) c.stars = stars.get(c.repo.toLowerCase())

  return { contributions, fetchedAt: new Date().toISOString() }
}

let cached: Promise<OpenSourceData> | undefined

/** Live data from GitHub at build time, falling back to the committed snapshot. */
export function getContributions(fallback: OpenSourceData): Promise<OpenSourceData> {
  cached ??= fetchContributions().catch((err) => {
    console.warn(`[open-source] GitHub fetch failed, using snapshot: ${err}`)
    return fallback
  })
  return cached
}
