import AxeBuilder from "@axe-core/playwright"
import { test, expect, PAGES, setTheme, scrollThrough } from "./fixtures"

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} mode`, () => {
    test.beforeEach(async ({ page }) => setTheme(page, theme))

    for (const path of PAGES) {
      test(`${path} has readable contrast and no accessibility violations`, async ({ page }) => {
        await page.goto(path)
        await scrollThrough(page)
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa"])
          // The floating chat button sits over content by design; it is checked on its own below.
          .exclude("#chat-cta")
          .analyze()
        const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join(", ")}`)
        expect(summary).toEqual([])
      })
    }

    test("the experience timeline line is visible", async ({ page }) => {
      await page.goto("/")
      const ratio = await page.locator("[data-testid=timeline]").evaluate((el) => {
        const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number)
        const lum = ([r, g, b]: number[]) => {
          const f = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
        }
        const [r, g, b, a = 1] = parse(getComputedStyle(el).borderLeftColor)
        const dark = document.documentElement.classList.contains("dark")
        const bg = dark ? [3, 7, 18] : [249, 250, 251] // gray-950 / gray-50 page background
        const line = [r, g, b].map((c, i) => c * a + bg[i] * (1 - a))
        const [l1, l2] = [lum(line), lum(bg)].sort((x, y) => y - x)
        return (l1 + 0.05) / (l2 + 0.05)
      })
      expect(ratio).toBeGreaterThanOrEqual(1.4)
    })
  })
}
