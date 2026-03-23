import { useCallback } from "react";
import { AchievementProgress } from "../types/achievement";
import { ACHIEVEMENTS } from "../data/achievements";
import { getStorageValue, setStorageValue } from "./useStorage";

const STORAGE_KEY = "@bp:achievements";

export function useAchievements() {
  const checkAndUpdate = useCallback(
    async (stats: {
      totalScore: number;
      maxCombo: number;
      perfectRate: number;
      songsClearedCount: number;
      totalKills: number;
      noMiss: boolean;
      fullLayer: boolean;
      playCount: number;
      bossKilled: boolean;
      currentSongId: string;
    }): Promise<string[]> => {
      const progress =
        (await getStorageValue<AchievementProgress[]>(STORAGE_KEY)) ?? [];
      const newUnlocks: string[] = [];

      for (const achievement of ACHIEVEMENTS) {
        const existing = progress.find(
          (p) => p.achievementId === achievement.id
        );
        if (existing?.unlocked) continue;

        let value = 0;
        let met = false;

        switch (achievement.conditionType) {
          case "total_score":
            value = stats.totalScore;
            met = value >= achievement.conditionValue;
            break;
          case "max_combo":
            value = stats.maxCombo;
            met = value >= achievement.conditionValue;
            break;
          case "perfect_rate":
            value = stats.perfectRate * 100;
            met = value >= achievement.conditionValue;
            break;
          case "songs_cleared":
            value = stats.songsClearedCount;
            met = value >= achievement.conditionValue;
            break;
          case "total_kills":
            value = stats.totalKills;
            met = value >= achievement.conditionValue;
            break;
          case "no_miss":
            met = stats.noMiss && (!achievement.conditionSongId || stats.currentSongId === achievement.conditionSongId);
            value = met ? 1 : 0;
            break;
          case "full_layer":
            met = stats.fullLayer;
            value = met ? 1 : 0;
            break;
          case "play_count":
            value = stats.playCount;
            met = value >= achievement.conditionValue;
            break;
          case "boss_kill":
            met = stats.bossKilled;
            value = met ? 1 : 0;
            break;
          default:
            break;
        }

        const idx = progress.findIndex(
          (p) => p.achievementId === achievement.id
        );
        const entry: AchievementProgress = {
          achievementId: achievement.id,
          currentValue: value,
          unlocked: met,
          unlockedAt: met ? new Date().toISOString() : undefined,
        };

        if (idx >= 0) {
          progress[idx] = entry;
        } else {
          progress.push(entry);
        }

        if (met && !existing?.unlocked) {
          newUnlocks.push(achievement.id);
        }
      }

      await setStorageValue(STORAGE_KEY, progress);
      return newUnlocks;
    },
    []
  );

  return { checkAndUpdate };
}
