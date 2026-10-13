import { test, expect } from "./fixtures"

test.beforeEach(async ({ page }) => {
  // The Netlify function is not part of `astro preview`; stand in for it with a fixed reply.
  await page.route("**/.netlify/functions/chat", async (route) => {
    const body = route.request().postDataJSON()
    expect(body.messages.at(-1).role).toBe("user")
    await route.fulfill({ json: { reply: "Akshat is based in Los Angeles and open to relocating." } })
  })
})

test("the chat opens, sends a question and shows the reply", async ({ page }) => {
  await page.goto("/")
  await page.locator("#chat-cta").click()
  await expect(page.locator("#chat-input")).toBeFocused()
  await page.locator("#chat-input").fill("Where is Akshat based?")
  await page.locator("#send-btn").click()
  await expect(page.locator("#chat-messages")).toContainText("open to relocating")
  await page.keyboard.press("Escape")
  await expect(page.locator("#chat-window")).toHaveClass(/opacity-0/)
})

test("the chat still opens after navigating away and back", async ({ page }) => {
  await page.goto("/")
  await page.locator("header a[aria-label=projects]").click()
  await expect(page).toHaveURL(/\/projects$/)
  await page.locator("header a[aria-label=experience]").click()
  await expect(page).toHaveURL(/\/#experience$/)
  await page.locator("#chat-cta").click()
  await expect(page.locator("#chat-window")).not.toHaveClass(/opacity-0/)
})

test("the open chat never covers page content on a laptop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "laptop", "phones use the floating panel")
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    await page.locator("#chat-cta").click()
    const panel = page.locator("#chat-window")
    await expect(panel).not.toHaveClass(/opacity-0/)
    await page.waitForTimeout(400) // let the page finish sliding over
    const panelLeft = (await panel.boundingBox())!.x

    const covered = await page.evaluate((left) => {
      const blocks = [...document.querySelectorAll("main section, header nav, footer")]
      return blocks
        .map((el) => ({ id: el.id || el.tagName.toLowerCase(), right: el.getBoundingClientRect().right }))
        .filter((b) => b.right > left + 1)
    }, panelLeft)
    expect(covered, `content under the chat at ${width}px`).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)

    await page.locator("#close-chat").click()
    await expect(page.locator("html")).not.toHaveClass(/chat-open/)
  }
})

test("the chat panel fits on a phone screen", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "laptops dock the panel")
  await page.goto("/")
  await page.locator("#chat-cta").click()
  const box = (await page.locator("#chat-window").boundingBox())!
  const viewport = page.viewportSize()!
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.y).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height)
})
