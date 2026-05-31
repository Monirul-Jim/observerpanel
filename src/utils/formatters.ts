export const PERIOD_KEYS = ['today', 'week', 'month', 'year'] as const;
export type PeriodKey = (typeof PERIOD_KEYS)[number];

export const PERIOD_LABELS = ['Today', 'This Week', 'This Month', 'This Year'] as const;

export function fmt(n: number): string {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  return `৳${n.toLocaleString()}`;
}

export function fmtFull(n: number): string {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)} Lakh`;
  return `৳${n.toLocaleString()}`;
}

export function rateColor(rate: number): string {
  if (rate >= 80) return '#22c55e';
  if (rate >= 60) return '#f59e0b';
  return '#ef4444';
}
