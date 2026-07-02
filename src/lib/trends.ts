export interface TrendPoint {
  month: string;
  value: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Deterministic bell-shaped 12-month series ending at `endValue`, for the
// dashboard trend charts. There's no historical event log yet to aggregate
// from, so this stands in as an illustrative shape until real data exists.
export function monthlySeries(endValue: number, referenceDate = new Date()): TrendPoint[] {
  const shape = [0.32, 0.4, 0.52, 0.68, 0.85, 1.0, 0.97, 0.8, 0.6, 0.45, 0.55, 0.7];
  const points: TrendPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
    const factor = shape[11 - i];
    const value = i === 0 ? endValue : Math.round(endValue * factor * (0.75 + 0.25 * ((11 - i) / 11)));
    points.push({ month: monthNames[d.getMonth()], value: Math.max(value, 0) });
  }
  return points;
}
