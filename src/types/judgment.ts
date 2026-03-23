/** Judgment grade */
export type Judgment = "perfect" | "great" | "good" | "miss";

/** Judgment result for one tap */
export interface JudgmentResult {
  judgment: Judgment;
  offsetMs: number;
  enemyId: string;
  score: number;
  tapPosition: { x: number; y: number };
  timestamp: number;
}

/** Timing windows in ms */
export const JUDGMENT_WINDOWS = {
  perfect: 30,
  great: 60,
  good: 100,
} as const;

/** Score multiplier per judgment */
export const JUDGMENT_SCORE_MULTIPLIER: Record<Judgment, number> = {
  perfect: 1.0,
  great: 0.7,
  good: 0.4,
  miss: 0.0,
};

/** Whether a judgment continues combo */
export const JUDGMENT_COMBO_CONTINUES: Record<Judgment, boolean> = {
  perfect: true,
  great: true,
  good: true,
  miss: false,
};
