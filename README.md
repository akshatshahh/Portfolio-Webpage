# Akshat Shah · Portfolio

Personal site built with [Astro](https://astro.build) and Tailwind CSS, deployed on Netlify.
Live at [akshatshah.tech](https://akshatshah.tech) (the old `akshatshah.netlify.app` address redirects there).

## Develop

```sh
pnpm install
pnpm dev            # http://localhost:4321
```

## Test

```sh
pnpm test:unit      # chat function, open source fetcher, date math (Vitest)
pnpm build          # type check + production build
pnpm test:e2e       # browser tests against the build (Playwright)
```

Browser tests run on a laptop (1440px) and a phone (Pixel 7), in light and dark mode. They check that
every page loads without script errors, nothing scrolls sideways at common widths, contrast and
accessibility (axe) pass, the theme survives navigation, links and images resolve, the chat works,
and the homepage stays short enough to scan.

First run: `pnpm exec playwright install chromium` (or set `PW_CHROMIUM_PATH` to an installed Chromium).

CI (`.github/workflows/ci.yml`) runs all of this on every pull request and push to `main`, and uploads
screenshots and traces when something fails. Netlify runs the unit tests before every deploy.

## Content

- Projects: `src/data/projects.ts` (screenshots in `public/projects/`)
- Open source: fetched from GitHub at build time (`src/lib/openSource.ts`); refresh the offline
  fallback with `pnpm oss:snapshot`. Release-note credits live in `src/data/releaseCredits.ts`.
- Daily refresh: `netlify/functions/daily-rebuild.mts` is a Netlify scheduled function that calls
  the site's build hook every day at 13:00 UTC, so the open source section stays current without a
  push. It reads the hook URL from the `NETLIFY_BUILD_HOOK` environment variable in Netlify; never
  commit the URL. Check it under Netlify → Logs → Functions → daily-rebuild.
- Resume: `public/Akshat-Shah-Resume.pdf` and its preview image `public/resume-preview.webp`
