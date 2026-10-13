import { test, expect, PAGES, horizontalOverflow, scrollThrough } from "./fixtures"

for (const path of PAGES) {
  test(`${path} renders without errors or sideways scrolling`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Akshat Shah/)
    await expect(page.locator("h1").first()).toBeVisible()
    await scrollThrough(page)
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
  })
}

test("every same-origin image actually loads", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path)
    const broken = await page.$$eval("img", async (imgs) => {
      const local = imgs.filter((img) => new URL(img.src, location.href).origin === location.origin)
      // Load lazy images now and wait for each to finish, so slow ones are not counted as broken.
      local.forEach((img) => (img.loading = "eager"))
      await Promise.all(
        local.map((img) =>
          img.complete
            ? null
            : new Promise((done) => {
                img.addEventListener("load", done)
                img.addEventListener("error", done)
              })
        )
      )
      return local.filter((img) => img.naturalWidth === 0).map((img) => img.src)
    })
    expect(broken, `broken images on ${path}`).toEqual([])
  }
})

test("every internal link and in-page anchor resolves", async ({ page, request }) => {
  const checked = new Set<string>()
  for (const path of PAGES) {
    await page.goto(path)
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? ""))
    for (const href of hrefs.filter((h) => h.startsWith("/"))) {
      const [target, anchor] = href.split("#")
      if (!checked.has(target)) {
        checked.add(target)
        const res = await request.get(target || "/")
        expect(res.status(), `${href} linked from ${path}`).toBe(200)
      }
      if (anchor) {
        const html = await (await request.get(target || "/")).text()
        expect(html, `#${anchor} missing for link on ${path}`).toContain(`id="${anchor}"`)
      }
    }
  }
})

test("the resume PDF is served", async ({ request }) => {
  const res = await request.get("/Akshat-Shah-Resume.pdf")
  expect(res.status()).toBe(200)
  expect(res.headers()["content-type"]).toContain("pdf")
})

test("an unknown page returns 404", async ({ request }) => {
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404)
})
