import { test, expect } from "./fixtures"

const isDark = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"))

async function chooseTheme(page: import("@playwright/test").Page, theme: "light" | "dark" | "system") {
  await page.locator("#theme-toggle-btn").click()
  await page.locator(`.themes-menu-option[data-theme=${theme}]`).click()
}

test("a chosen theme survives navigation, back and reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" })
  await page.goto("/")
  await chooseTheme(page, "dark")
  await expect.poll(() => isDark(page)).toBe(true)

  await page.locator("header a[aria-label=resume]").click()
  await expect(page).toHaveURL(/\/resume$/)
  await expect.poll(() => isDark(page)).toBe(true)

  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect.poll(() => isDark(page)).toBe(true)

  await page.reload()
  await expect.poll(() => isDark(page)).toBe(true)
})

test("light stays light even when the device prefers dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")
  await chooseTheme(page, "light")
  await expect.poll(() => isDark(page)).toBe(false)
  await page.locator("header a[aria-label=projects]").click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect.poll(() => isDark(page)).toBe(false)
})

test("the theme menu still works after navigating", async ({ page }) => {
  await page.goto("/")
  await page.locator("header a[aria-label=open-source]").click()
  await expect(page).toHaveURL(/\/open-source$/)
  await chooseTheme(page, "dark")
  await expect.poll(() => isDark(page)).toBe(true)
  await chooseTheme(page, "light")
  await expect.poll(() => isDark(page)).toBe(false)
})

test("system follows the device setting", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")
  await expect.poll(() => isDark(page)).toBe(true)
  await page.emulateMedia({ colorScheme: "light" })
  await expect.poll(() => isDark(page)).toBe(false)
})

test("the saved theme is applied before first paint", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" })
  await page.addInitScript(() => localStorage.setItem("theme", "dark"))
  await page.goto("/", { waitUntil: "commit" })
  await page.waitForSelector("body", { state: "attached" })
  expect(await isDark(page)).toBe(true)
})
