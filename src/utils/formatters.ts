export const PERIOD_KEYS = ['today', 'week', 'month', 'year'] as const;
export type PeriodKey = (typeof PERIOD_KEYS)[number];

export const PERIOD_LABELS = ['Today', 'This Week', 'This Month', 'This Year'] as const;

export function fmt(n: number): string {
  return `৳${n.toLocaleString()}`;
}

export function fmtFull(n: number): string {
  return `৳${n.toLocaleString()}`;
}

export function rateColor(rate: number): string {
  if (rate >= 80) return '#22c55e';
  if (rate >= 60) return '#f59e0b';
  return '#ef4444';
}
