import { test as base, expect, type Page } from "@playwright/test"
import { FEATURED_PROJECTS } from "../../src/data/projects"

export const PAGES = ["/", "/projects", "/open-source", "/resume", ...FEATURED_PROJECTS.map((p) => `/projects/${p.slug}`)]

const isLocal = (url: string) => {
  const { hostname } = new URL(url)
  return hostname === "localhost" || hostname === "127.0.0.1"
}

/**
 * Every test gets a page that:
 * - never touches the network beyond the local site (GitHub avatars etc. are blocked),
 *   so results do not depend on third-party uptime;
 * - fails the test on any uncaught script error or same-origin console error.
 */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = []
      await page.route("**/*", (route) => (isLocal(route.request().url()) ? route.continue() : route.abort()))
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`))
      page.on("console", (msg) => {
        if (msg.type() !== "error") return
        const source = msg.location().url
        if (source && !isLocal(source)) return
        if (msg.text().includes("net::ERR_FAILED")) return // the blocked third-party requests above
        errors.push(`console: ${msg.text()}`)
      })
      await use(errors)
      expect(errors, "page logged errors").toEqual([])
    },
    { auto: true },
  ],
})

export { expect }

export async function setTheme(page: Page, theme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: theme })
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme)
}

/** Scroll the whole page so lazy images load and scroll-driven styles settle. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
}

export const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
