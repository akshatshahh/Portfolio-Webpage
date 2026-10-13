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
