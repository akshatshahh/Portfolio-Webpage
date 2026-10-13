import type { APIRoute } from "astro"
import { FEATURED_PROJECTS, MORE_PROJECTS } from "@/data/projects"
import { PROFILE, SKILL_GROUPS } from "@/data/profile"
import { RELEASE_CREDITS } from "@/data/releaseCredits"
import snapshot from "@/data/open-source-snapshot.json"
import { getContributions, type OpenSourceData } from "@/lib/openSource"

// A plain-text profile for AI assistants and crawlers (https://llmstxt.org), built from the
// same data as the site so it never drifts.
export const GET: APIRoute = async () => {
  const { contributions } = await getContributions(snapshot as OpenSourceData)
  const merged = contributions.filter((c) => c.state === "merged")
  const topMerged = [...merged].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0)).slice(0, 5)
  const site = PROFILE.site

  const lines = [
    `# ${PROFILE.name}`,
    "",
    `> ${PROFILE.summary}`,
    "",
    `- Titles: ${PROFILE.titles.join(", ")} (backend and full stack)`,
    `- Location: ${PROFILE.location.city}, ${PROFILE.location.region}, USA. ${PROFILE.relocation}.`,
    `- Looking for: ${PROFILE.lookingFor.join(", ")} roles`,
    `- Current role: Software Engineer at ${PROFILE.employer.name}`,
    "- Previous: Software Engineer Intern at Microsoft (OneDrive and SharePoint), Lead Teaching Assistant at the USC Viterbi K-12 STEM Center",
    `- Education: ${PROFILE.education.map((e) => `${e.degree}, ${e.name} (${e.year})`).join("; ")}`,
    `- Contact: ${PROFILE.email}`,
    `- GitHub: ${PROFILE.github}`,
    `- LinkedIn: ${PROFILE.linkedin}`,
    "",
    "## Key pages",
    "",
    `- [Portfolio home](${site}/): summary, experience, open source and skills`,
    `- [Resume](${site}/resume/): full resume as text and PDF`,
    `- [Projects](${site}/projects/): case studies and all projects`,
    `- [Open source](${site}/open-source/): every upstream pull request, updated daily`,
    "",
    "## Case studies",
    "",
    ...FEATURED_PROJECTS.map((p) => `- [${p.title}](${site}/projects/${p.slug}/): ${p.tagline} Stack: ${p.tags.map((t) => t.name).join(", ")}.`),
    "",
    "## Other projects",
    "",
    ...MORE_PROJECTS.map((p) => `- ${p.title}${p.private ? " (private repo)" : ""}: ${p.description}`),
    "",
    "## Open source",
    "",
    `${merged.length} pull requests shipped to upstream projects.`,
    "",
    ...RELEASE_CREDITS.map((r) => `- Credited in ${r.repo} ${r.version} release (${r.date}): ${r.title ?? ""} ${r.pr}`),
    ...topMerged.map((c) => `- Merged in ${c.repo}${c.stars ? ` (${c.stars.toLocaleString("en-US")} stars)` : ""}: ${c.title} ${c.url}`),
    "",
    "## Skills",
    "",
    ...SKILL_GROUPS.map((g) => `- ${g.name}: ${g.tags.map((t) => t.name).join(", ")}`),
    "",
  ]

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
