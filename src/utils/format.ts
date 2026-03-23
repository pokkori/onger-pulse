/** Format number with comma separators */
export function formatScore(score: number): string {
  return score.toLocaleString();
}

/** Format percentage */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/** Get rank from perfect rate */
export function getRank(
  perfectRate: number
): "S" | "A" | "B" | "C" | "D" {
  if (perfectRate >= 0.9) return "S";
  if (perfectRate >= 0.75) return "A";
  if (perfectRate >= 0.6) return "B";
  if (perfectRate >= 0.4) return "C";
  return "D";
}
