/** Start (Monday, 00:00 UTC) of the week containing `date`. */
export function startOfWeekUtc(date: Date): Date {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const daysSinceMonday = (start.getUTCDay() + 6) % 7;
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  return start;
}

function toDayKeyUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Counts consecutive practice days ending today (or yesterday, if today has no
 * solve yet — a streak shouldn't break just because the day isn't over).
 * Day boundaries are UTC; this is a deliberate simplification for a small
 * internal tool rather than per-user timezone tracking.
 */
export function computeStreakDays(solvedDates: readonly Date[], now: Date = new Date()): number {
  if (solvedDates.length === 0) return 0;

  const dayKeys = new Set(solvedDates.map(toDayKeyUtc));
  const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  if (!dayKeys.has(toDayKeyUtc(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (dayKeys.has(toDayKeyUtc(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}
