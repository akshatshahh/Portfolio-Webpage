import { test, expect, PAGES } from "./fixtures"

const SITE = "https://akshatshah.netlify.app"
const withSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`)

test("every page has a canonical URL, a description and a share card", async ({ page, request }) => {
  const descriptions = new Set<string>()
  for (const path of PAGES) {
    await page.goto(path)
    const head = page.locator("head")
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE}${withSlash(path)}`)
    const description = (await head.locator('meta[name="description"]').getAttribute("content")) ?? ""
    expect(description.length, `description on ${path}`).toBeGreaterThan(50)
    descriptions.add(description)
    for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
      await expect(head.locator(`meta[property="${property}"]`), `${property} on ${path}`).toHaveCount(1)
    }
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image")
    const image = (await head.locator('meta[property="og:image"]').getAttribute("content"))!
    const res = await request.get(new URL(image).pathname)
    expect(res.status(), `share image for ${path}`).toBe(200)
    expect(res.headers()["content-type"]).toContain("image/")
  }
  expect(descriptions.size, "each page should describe itself differently").toBeGreaterThan(PAGES.length - 3)
})

test("the homepage tells search engines and AI assistants who Akshat is", async ({ page }) => {
  await page.goto("/")
  const raw = await page.locator('script[type="application/ld+json"]').textContent()
  const data = JSON.parse(raw ?? "{}")
  expect(data["@type"]).toBe("ProfilePage")
  const person = data.mainEntity
  expect(person).toMatchObject({ "@type": "Person", name: "Akshat Shah" })
  expect(person.jobTitle).toEqual(expect.arrayContaining(["Software Engineer", "AI Engineer"]))
  expect(person.address).toMatchObject({ addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" })
  expect(person.sameAs).toEqual(expect.arrayContaining(["https://github.com/akshatshahh"]))
  expect(person.knowsAbout).toEqual(expect.arrayContaining(["Python", "FastAPI", "PyTorch", "LangChain"]))
  expect(person.alumniOf.map((s: { name: string }) => s.name)).toContain("University of Southern California")
})

test("other pages carry structured data that points back to the person", async ({ page }) => {
  for (const path of PAGES.filter((p) => p !== "/")) {
    await page.goto(path)
    const data = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}")
    expect(data["@type"], path).toBe("WebPage")
    expect(data.author.name, path).toBe("Akshat Shah")
  }
})

test("robots.txt points to a sitemap that lists every page", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text()
  const sitemapUrl = robots.match(/Sitemap:\s*(\S+)/)?.[1]
  expect(sitemapUrl).toBeTruthy()
  const index = await request.get(new URL(sitemapUrl!).pathname)
  expect(index.status()).toBe(200)
  const childUrls = [...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const listed = new Set<string>()
  for (const child of childUrls) {
    const xml = await (await request.get(new URL(child).pathname)).text()
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) listed.add(m[1])
  }
  for (const path of PAGES) expect(listed, `sitemap should list ${path}`).toContain(`${SITE}${withSlash(path)}`)
})

test("llms.txt gives AI assistants a plain-text profile", async ({ request }) => {
  const res = await request.get("/llms.txt")
  expect(res.status()).toBe(200)
  expect(res.headers()["content-type"]).toContain("text/plain")
  const text = await res.text()
  expect(text).toMatch(/^# Akshat Shah/)
  for (const fact of ["AI Engineer", "Los Angeles", "Open to relocating", "Microsoft", "University of Southern California"]) {
    expect(text, fact).toContain(fact)
  }
  for (const path of PAGES.filter((p) => p.startsWith("/projects/"))) expect(text).toContain(`${SITE}${withSlash(path)}`)
})

test("the resume is readable as text without exposing the phone number", async ({ page }) => {
  await page.goto("/resume")
  const text = page.getByTestId("resume-text")
  await expect(text).toBeAttached()
  for (const fact of ["Microsoft", "FastAPI", "University of Southern California", "500+ daily active users"]) {
    await expect(text).toContainText(fact)
  }
  expect(await page.content()).not.toContain("231-8298")
  await page.getByText("Read the resume as text").click()
  await expect(text).toBeVisible()
})

test("AI Engineer is visible without scrolling and the skills include AI", async ({ page }) => {
  await page.goto("/")
  const title = page.getByText("Software Engineer · AI Engineer", { exact: false }).first()
  await expect(title).toBeInViewport()
  const ai = page.locator('#skills section[aria-label="AI & LLM engineering"] li')
  expect(await ai.count()).toBeGreaterThanOrEqual(8)
})

test("the Google Search Console verification file is served unchanged", async ({ request }) => {
  const res = await request.get("/google63cede610adae9ca.html")
  expect(res.status()).toBe(200)
  expect(await res.text()).toBe("google-site-verification: google63cede610adae9ca.html")
})
