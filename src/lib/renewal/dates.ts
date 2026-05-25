// Renewal deadline policy.
// Mirror of `flent-renewals/lib/dates.ts` — keep in sync.

export type DeadlineInfo = {
  deadline: Date;
  effectiveFrom: Date;
  isPastDue: boolean;
  daysToDeadline: number;
};

export function computeDeadlineInfo(
  moveOutDate: string | Date | null,
  today: Date = new Date(),
): DeadlineInfo {
  const moveOut = moveOutDate ? toDate(moveOutDate) : null;
  const anchor = moveOut && moveOut.getTime() > today.getTime() ? moveOut : today;
  const deadline = firstOfNextMonth(anchor);
  const startOfToday = startOfDay(today);
  return {
    deadline,
    effectiveFrom: deadline,
    isPastDue: !!moveOut && moveOut.getTime() < startOfToday.getTime(),
    daysToDeadline: Math.max(0, Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000)),
  };
}

export function formatLongDate(d: Date | string): string {
  const dt = typeof d === "string" ? toDate(d) : d;
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function toDate(v: Date | string): Date {
  if (v instanceof Date) return v;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (m) return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
  return new Date(v);
}

function firstOfNextMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
