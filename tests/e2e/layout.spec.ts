import { test, expect, PAGES, horizontalOverflow } from "./fixtures"

const WIDTHS = [360, 390, 768, 1024, 1280, 1440, 1920]

test("no page scrolls sideways at common screen widths", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "laptop", "covers every width in one project")
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of PAGES) {
      await page.goto(path)
      expect(await horizontalOverflow(page), `${path} at ${width}px`).toBeLessThanOrEqual(0)
    }
  }
})

test("a recruiter sees the essentials without scrolling", async ({ page }) => {
  await page.goto("/")
  const viewport = page.viewportSize()!
  for (const text of ["Akshat Shah", "Los Angeles, CA", "anywhere in the US"]) {
    const box = await page.getByText(text).first().boundingBox()
    expect(box, `"${text}" should be on the page`).not.toBeNull()
    expect(box!.y, `"${text}" should be above the fold`).toBeLessThan(viewport.height)
  }
  await expect(page.getByRole("link", { name: "View resume" })).toBeVisible()
})

test("the homepage stays short", async ({ page }, testInfo) => {
  await page.goto("/")
  const { height } = page.viewportSize()!
  const screens = (await page.evaluate(() => document.documentElement.scrollHeight)) / height
  // Recruiters rarely scroll far: keep the homepage a summary and put depth on other pages.
  const budget = testInfo.project.name === "mobile" ? 12 : 5.5
  expect(screens).toBeLessThanOrEqual(budget)
})

test("the header nav fits on one line", async ({ page }) => {
  await page.goto("/")
  const nav = page.locator("header nav")
  const box = await nav.boundingBox()
  expect(box!.height).toBeLessThanOrEqual(56)
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width)
})

test("nav links reach their pages and sections", async ({ page }) => {
  await page.goto("/projects")
  await page.locator("header a[aria-label=experience]").click()
  await expect(page).toHaveURL(/\/#experience$/)
  await expect(page.locator("#experience")).toBeInViewport()

  await page.locator("header a[aria-label=open-source]").click()
  await expect(page).toHaveURL(/\/open-source$/)
  await expect(page.getByRole("heading", { level: 1, name: "Open Source" })).toBeVisible()

  await page.locator("header a[aria-label=resume]").click()
  await expect(page).toHaveURL(/\/resume$/)
  await expect(page.getByRole("link", { name: "Download PDF" })).toBeVisible()
})

test("each featured project links to its case study", async ({ page }) => {
  await page.goto("/")
  const caseStudies = page.locator("#projects").getByRole("link", { name: "Case study", exact: true })
  const count = await caseStudies.count()
  expect(count).toBeGreaterThanOrEqual(3)
  for (let i = 0; i < count; i++) {
    await page.goto("/")
    await caseStudies.nth(i).click()
    await expect(page).toHaveURL(/\/projects\/[a-z-]+$/)
    await expect(page.getByRole("heading", { name: "Key engineering decisions" })).toBeVisible()
  }
})

test("open source shows release credits and contributions", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("#release-credits")).toBeVisible()
  const top = page.getByTestId("contributions").locator(":scope > li")
  await expect(top).toHaveCount(4)
  await page.getByRole("link", { name: /See all \d+ contributions/ }).click()
  await expect(page).toHaveURL(/\/open-source$/)
  expect(await page.getByTestId("contributions").locator(":scope > li").count()).toBeGreaterThan(4)
})

test("open source shows when it was last refreshed", async ({ page }) => {
  for (const path of ["/", "/open-source"]) {
    await page.goto(path)
    const stamp = page.getByTestId("oss-updated")
    await expect(stamp).toBeVisible()
    await expect(stamp).toHaveText(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/)
    const refreshedAt = (await stamp.getAttribute("datetime")) ?? ""
    expect(Number.isNaN(Date.parse(refreshedAt))).toBe(false)
    // Shown as the calendar day in Los Angeles, not UTC (a 10pm Pacific build is still "today").
    const pacificDay = new Date(refreshedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Los_Angeles",
    })
    await expect(stamp).toHaveText(pacificDay)
  }
})
