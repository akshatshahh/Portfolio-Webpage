/** Releases whose notes credit me by name. GitHub has no API for this, so it is kept by hand. */
export interface ReleaseCredit {
  repo: string
  version: string
  date: string
  /** The contribution being credited */
  title?: string
  quote: string
  quoteBy?: string
  url: string
  urlLabel: string
  pr: string
}

export const RELEASE_CREDITS: ReleaseCredit[] = [
  {
    repo: "reticlehq/reticle",
    version: "v3.6.0",
    date: "2026-10-07",
    title: "Find submit controls across realms, so the destructive-action guard works inside iframes",
    quote:
      "Thank you @akshatshahh! This change shipped in Reticle 3.6.0 … You're credited in the release notes.",
    quoteBy: "@divshekhar, reticle maintainer",
    url: "https://github.com/reticlehq/reticle/releases/tag/v3.6.0",
    urlLabel: "Read the release notes",
    pr: "https://github.com/reticlehq/reticle/pull/1399",
  },
  {
    repo: "MakazhanAlpamys/Soup",
    version: "v0.76.0",
    date: "2026-10-12",
    title: "One shared loopback allowlist for every outbound gate, so IPv6 loopback judge URLs work",
    quote:
      "The outbound loopback allowlist is now a single shared set … Each gate previously kept its own literal, which refused the IPv6 loopback (#1548 by @akshatshahh in #1554).",
    url: "https://github.com/MakazhanAlpamys/Soup/blob/v0.76.0/CHANGELOG.md#0760---2026-10-12",
    urlLabel: "Read the changelog",
    pr: "https://github.com/MakazhanAlpamys/Soup/pull/1554",
  },
]
