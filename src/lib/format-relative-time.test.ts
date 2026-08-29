import { describe, expect, test } from "vite-plus/test";

import { formatRelativeTime } from "./format-relative-time";

describe("formatRelativeTime", () => {
  const now = new Date("2026-08-29T12:00:00Z");

  test("returns 'just now' for sub-minute gaps", () => {
    expect(formatRelativeTime(new Date("2026-08-29T11:59:45Z"), now)).toBe("just now");
  });

  test("returns minutes for sub-hour gaps", () => {
    expect(formatRelativeTime(new Date("2026-08-29T11:45:00Z"), now)).toBe("15m ago");
  });

  test("returns hours for sub-day gaps", () => {
    expect(formatRelativeTime(new Date("2026-08-29T09:00:00Z"), now)).toBe("3h ago");
  });

  test("returns 'Yesterday' for exactly one day back", () => {
    expect(formatRelativeTime(new Date("2026-08-28T12:00:00Z"), now)).toBe("Yesterday");
  });

  test("returns days for under a week", () => {
    expect(formatRelativeTime(new Date("2026-08-25T12:00:00Z"), now)).toBe("4 days ago");
  });

  test("falls back to a short date for a week or more", () => {
    expect(formatRelativeTime(new Date("2026-08-01T12:00:00Z"), now)).toBe("Aug 1");
  });
});
