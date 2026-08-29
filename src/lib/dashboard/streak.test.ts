import { describe, expect, test } from "vite-plus/test";

import { computeStreakDays, startOfWeekUtc } from "./streak";

const NOW = new Date("2026-08-29T12:00:00Z"); // a Saturday

function daysAgo(n: number): Date {
  const date = new Date(NOW);
  date.setUTCDate(date.getUTCDate() - n);
  return date;
}

describe("computeStreakDays", () => {
  test("no solves is a zero streak", () => {
    expect(computeStreakDays([], NOW)).toBe(0);
  });

  test("solving today counts as a 1-day streak", () => {
    expect(computeStreakDays([daysAgo(0)], NOW)).toBe(1);
  });

  test("consecutive days chain into one streak", () => {
    expect(computeStreakDays([daysAgo(0), daysAgo(1), daysAgo(2)], NOW)).toBe(3);
  });

  test("multiple solves on the same day only count once", () => {
    const today = daysAgo(0);
    const alsoToday = new Date(today.getTime() + 60 * 60 * 1000);
    expect(computeStreakDays([today, alsoToday], NOW)).toBe(1);
  });

  test("a streak survives today having no solve yet", () => {
    expect(computeStreakDays([daysAgo(1), daysAgo(2)], NOW)).toBe(2);
  });

  test("a gap breaks the streak", () => {
    expect(computeStreakDays([daysAgo(2)], NOW)).toBe(0);
  });

  test("dates out of order are still handled correctly", () => {
    expect(computeStreakDays([daysAgo(2), daysAgo(0), daysAgo(1)], NOW)).toBe(3);
  });
});

describe("startOfWeekUtc", () => {
  test("returns the preceding Monday at midnight UTC", () => {
    const monday = startOfWeekUtc(NOW);
    expect(monday.toISOString()).toBe("2026-08-24T00:00:00.000Z");
  });

  test("a Monday maps to itself", () => {
    const monday = new Date("2026-08-24T15:30:00Z");
    expect(startOfWeekUtc(monday).toISOString()).toBe("2026-08-24T00:00:00.000Z");
  });
});
