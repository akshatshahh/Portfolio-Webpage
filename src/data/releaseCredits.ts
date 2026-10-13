/** Releases whose notes credit me by name. GitHub has no API for this, so it is kept by hand. */
export interface ReleaseCredit {
  repo: string
  version: string
  date: string
  quote: string
  url: string
  urlLabel: string
  pr: string
}

export const RELEASE_CREDITS: ReleaseCredit[] = [
  {
    repo: "reticlehq/reticle",
    version: "v3.6.0",
    date: "2026-10-07",
    quote:
      "A page that redirects on load no longer reports as \"no browser session connected\" … the diagnosis says the page navigated away to <url>.",
    url: "https://github.com/reticlehq/reticle/releases/tag/v3.6.0",
    urlLabel: "Read the release notes",
    pr: "https://github.com/reticlehq/reticle/pull/1308",
  },
  {
    repo: "MakazhanAlpamys/Soup",
    version: "v0.76.0",
    date: "2026-10-12",
    quote:
      "The outbound loopback allowlist is now a single shared set … Each gate previously kept its own literal, which refused the IPv6 loopback (#1548 by @akshatshahh in #1554).",
    url: "https://github.com/MakazhanAlpamys/Soup/blob/v0.76.0/CHANGELOG.md#0760---2026-10-12",
    urlLabel: "Read the changelog",
    pr: "https://github.com/MakazhanAlpamys/Soup/pull/1554",
  },
]
