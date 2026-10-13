// Refreshes the fallback used when GitHub is unreachable at build time.
// Run with: pnpm oss:snapshot
import { writeFileSync } from "node:fs"
import { fetchContributions } from "../src/lib/openSource.ts"

const data = await fetchContributions()
writeFileSync(new URL("../src/data/open-source-snapshot.json", import.meta.url), JSON.stringify(data, null, 2) + "\n")
console.log(`Saved ${data.contributions.length} contributions`)
