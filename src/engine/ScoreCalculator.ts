import { Judgment, JUDGMENT_SCORE_MULTIPLIER } from "../types/judgment";

const MAX_COMBO_MULTIPLIER = 3.0;

export class ScoreCalculator {
  static calculate(
    baseScore: number,
    judgment: Judgment,
    combo: number
  ): number {
    const judgmentMult = JUDGMENT_SCORE_MULTIPLIER[judgment];
    const comboMult = Math.min(
      1.0 + Math.floor(combo / 10) * 0.1,
      MAX_COMBO_MULTIPLIER
    );
    return Math.floor(baseScore * judgmentMult * comboMult);
  }

  static calculateRank(perfectRate: number): "S" | "A" | "B" | "C" | "D" {
    if (perfectRate >= 0.9) return "S";
    if (perfectRate >= 0.75) return "A";
    if (perfectRate >= 0.6) return "B";
    if (perfectRate >= 0.4) return "C";
    return "D";
  }
}
