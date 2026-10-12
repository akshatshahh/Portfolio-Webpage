const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2025-03" -> index of months since year 0 */
function toIndex(ym: string): number {
  const [y, m] = ym.split("-").map(Number)
  return y * 12 + (m - 1)
}

function currentIndex(): number {
  const now = new Date()
  return now.getFullYear() * 12 + now.getMonth()
}

export function formatMonth(ym: string): string {
  const i = toIndex(ym)
  return `${MONTHS[i % 12]} ${Math.floor(i / 12)}`
}

export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} - ${end ? formatMonth(end) : "Present"}`
}

/** LinkedIn-style duration, counting both the start and end month ("1 yr 8 mos"). */
export function formatDuration(start: string, end?: string): string {
  const months = (end ? toIndex(end) : currentIndex()) - toIndex(start) + 1
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`)
  if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`)
  return parts.join(" ")
}
