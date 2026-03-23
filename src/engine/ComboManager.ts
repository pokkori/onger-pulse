export class ComboManager {
  static readonly LAYER_THRESHOLDS: number[] = [0, 5, 15, 30, 50];

  static getActiveLayerCount(combo: number): number {
    let count = 0;
    for (const threshold of ComboManager.LAYER_THRESHOLDS) {
      if (combo >= threshold) count++;
    }
    return Math.max(count, 1); // drums always plays
  }

  static getMultiplier(combo: number): number {
    return Math.min(1.0 + Math.floor(combo / 10) * 0.1, 3.0);
  }

  static checkMilestone(
    prevCombo: number,
    newCombo: number
  ): number | null {
    const milestones = [5, 10, 25, 50];
    for (const m of milestones) {
      if (prevCombo < m && newCombo >= m) return m;
    }
    return null;
  }
}
