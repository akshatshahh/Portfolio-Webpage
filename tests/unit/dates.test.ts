import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { formatDuration, formatMonth, formatRange } from "@/lib/dates"

describe("dates", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-13T12:00:00Z"))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("formats months like the experience section", () => {
    expect(formatMonth("2025-03")).toBe("Mar 2025")
    expect(formatMonth("2023-06")).toBe("June 2023")
    expect(formatRange("2026-08")).toBe("Aug 2026 - Present")
    expect(formatRange("2025-03", "2026-08")).toBe("Mar 2025 - Aug 2026")
  })

  it("counts both the start and end month, matching LinkedIn", () => {
    expect(formatDuration("2025-03", "2026-08")).toBe("1 yr 6 mos")
    expect(formatDuration("2023-06", "2023-07")).toBe("2 mos")
    expect(formatDuration("2025-04", "2025-07")).toBe("4 mos")
  })

  it("measures an ongoing role up to the current month", () => {
    expect(formatDuration("2026-08")).toBe("3 mos")
    expect(formatDuration("2025-03")).toBe("1 yr 8 mos")
  })

  it("handles exact years and single months", () => {
    expect(formatDuration("2024-01", "2025-12")).toBe("2 yrs")
    expect(formatDuration("2024-05", "2024-05")).toBe("1 mo")
  })
})
