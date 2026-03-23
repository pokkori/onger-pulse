import { EnemyType } from "../types/enemy";

export interface DifficultyParams {
  allowedEnemyTypes: EnemyType[];
  spawnIntervalMultiplier: number;
  speedMultiplier: number;
  maxSimultaneous: number;
}

export class DifficultyManager {
  static getParams(progress: number): DifficultyParams {
    if (progress < 0.2) {
      return {
        allowedEnemyTypes: ["normal"],
        spawnIntervalMultiplier: 1.5,
        speedMultiplier: 0.8,
        maxSimultaneous: 1,
      };
    }
    if (progress < 0.4) {
      return {
        allowedEnemyTypes: ["normal", "fast"],
        spawnIntervalMultiplier: 1.2,
        speedMultiplier: 1.0,
        maxSimultaneous: 2,
      };
    }
    if (progress < 0.6) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy"],
        spawnIntervalMultiplier: 1.0,
        speedMultiplier: 1.0,
        maxSimultaneous: 3,
      };
    }
    if (progress < 0.8) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy", "split"],
        spawnIntervalMultiplier: 0.8,
        speedMultiplier: 1.2,
        maxSimultaneous: 4,
      };
    }
    if (progress < 0.95) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy", "split"],
        spawnIntervalMultiplier: 0.6,
        speedMultiplier: 1.3,
        maxSimultaneous: 5,
      };
    }
    return {
      allowedEnemyTypes: ["normal", "fast", "boss"],
      spawnIntervalMultiplier: 0.7,
      speedMultiplier: 1.0,
      maxSimultaneous: 3,
    };
  }
}
