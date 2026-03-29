import { EnemyType } from "../types/enemy";

export interface DifficultyParams {
  allowedEnemyTypes: EnemyType[];
  spawnIntervalMultiplier: number;
  speedMultiplier: number;
  maxSimultaneous: number;
}

export class DifficultyManager {
  /**
   * Refined 8-zone difficulty curve (was 6-zone).
   * Zone 0-1: Safety net (first ~20% = ~30 sec at normal song).
   * Adds gradual complexity introduction.
   */
  static getParams(progress: number): DifficultyParams {
    // Zone 0: Tutorial (0-10%) - absolute safety net, slow enemies
    if (progress < 0.1) {
      return {
        allowedEnemyTypes: ["normal"],
        spawnIntervalMultiplier: 1.8,
        speedMultiplier: 0.7,
        maxSimultaneous: 1,
      };
    }
    // Zone 1: Learning (10-20%) - still easy
    if (progress < 0.2) {
      return {
        allowedEnemyTypes: ["normal"],
        spawnIntervalMultiplier: 1.4,
        speedMultiplier: 0.85,
        maxSimultaneous: 1,
      };
    }
    // Zone 2: Fast introduction (20-35%)
    if (progress < 0.35) {
      return {
        allowedEnemyTypes: ["normal", "fast"],
        spawnIntervalMultiplier: 1.2,
        speedMultiplier: 1.0,
        maxSimultaneous: 2,
      };
    }
    // Zone 3: Heavy introduction (35-50%)
    if (progress < 0.5) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy"],
        spawnIntervalMultiplier: 1.0,
        speedMultiplier: 1.0,
        maxSimultaneous: 3,
      };
    }
    // Zone 4: Split introduction (50-65%)
    if (progress < 0.65) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy", "split"],
        spawnIntervalMultiplier: 0.85,
        speedMultiplier: 1.15,
        maxSimultaneous: 4,
      };
    }
    // Zone 5: Intensity ramp (65-80%)
    if (progress < 0.8) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy", "split"],
        spawnIntervalMultiplier: 0.7,
        speedMultiplier: 1.25,
        maxSimultaneous: 5,
      };
    }
    // Zone 6: Climax (80-95%) - maximum pressure
    if (progress < 0.95) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy", "split"],
        spawnIntervalMultiplier: 0.55,
        speedMultiplier: 1.35,
        maxSimultaneous: 6,
      };
    }
    // Zone 7: Boss finale (95-100%)
    return {
      allowedEnemyTypes: ["normal", "fast", "boss"],
      spawnIntervalMultiplier: 0.7,
      speedMultiplier: 1.0,
      maxSimultaneous: 3,
    };
  }

  /**
   * Variable reward: chance for a "star enemy" that gives bonus score.
   * Returns true if the next enemy should be a star enemy (gold glow, 5x score).
   */
  static shouldSpawnStarEnemy(progress: number, combo: number): boolean {
    // Star enemies appear after 20% progress, with higher chance at higher combo
    if (progress < 0.2) return false;
    const baseChance = 0.05; // 5% base
    const comboBonus = Math.min(combo / 100, 0.1); // up to +10% from combo
    return Math.random() < (baseChance + comboBonus);
  }
}
