// Rebuilds the site once a day so the Open Source section (fetched from GitHub at build
// time) stays current even when nobody pushes to the repo. Netlify runs scheduled
// functions on the published site only, so previews never trigger it.
//
// Setup: Netlify → Site configuration → Build & deploy → Build hooks → add a hook, then
// save its URL as the NETLIFY_BUILD_HOOK environment variable. Never commit the URL.

export const REBUILD_TITLE = "Daily open source refresh"

export async function triggerRebuild(hookUrl: string | undefined, fetchImpl: typeof fetch = fetch) {
  if (!hookUrl) {
    console.warn("[daily-rebuild] NETLIFY_BUILD_HOOK is not set; skipping")
    return { triggered: false, reason: "missing-hook" } as const
  }
  const url = new URL(hookUrl)
  url.searchParams.set("trigger_title", REBUILD_TITLE)
  const res = await fetchImpl(url, { method: "POST", body: "{}" })
  if (!res.ok) throw new Error(`[daily-rebuild] build hook returned ${res.status}`)
  return { triggered: true } as const
}

export default async () => {
  const result = await triggerRebuild(process.env.NETLIFY_BUILD_HOOK)
  return Response.json(result)
}

// 13:00 UTC = 6am Pacific in daylight time (5am in winter).
export const config = { schedule: "0 13 * * *" }
