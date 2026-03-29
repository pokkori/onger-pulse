import { Judgment, JUDGMENT_SCORE_MULTIPLIER } from "../types/judgment";

const MAX_COMBO_MULTIPLIER = 3.0;

/** Star enemy score multiplier (variable reward) */
export const STAR_ENEMY_MULTIPLIER = 5.0;

/** ニアミスメッセージ4パターン */
export const NEAR_MISS_MESSAGES = [
  'おしい！',
  'あと少し！',
  '惜しかった...',
  'ギリギリ！',
] as const;

export class ScoreCalculator {
  static calculate(
    baseScore: number,
    judgment: Judgment,
    combo: number,
    isStarEnemy: boolean = false
  ): number {
    const judgmentMult = JUDGMENT_SCORE_MULTIPLIER[judgment];
    const comboMult = Math.min(
      1.0 + Math.floor(combo / 10) * 0.1,
      MAX_COMBO_MULTIPLIER
    );
    const starMult = isStarEnemy ? STAR_ENEMY_MULTIPLIER : 1.0;
    return Math.floor(baseScore * judgmentMult * comboMult * starMult);
  }

  static calculateRank(perfectRate: number): "S" | "A" | "B" | "C" | "D" {
    if (perfectRate >= 0.9) return "S";
    if (perfectRate >= 0.75) return "A";
    if (perfectRate >= 0.6) return "B";
    if (perfectRate >= 0.4) return "C";
    return "D";
  }

  /** Pick a random near-miss message */
  static pickNearMissMessage(): string {
    return NEAR_MISS_MESSAGES[Math.floor(Math.random() * NEAR_MISS_MESSAGES.length)];
  }
}
