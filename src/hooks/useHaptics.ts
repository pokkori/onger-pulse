import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useSettingsStore } from "../stores/settingsStore";
import { Judgment } from "../types/judgment";

export function useHaptics() {
  const enabled = useSettingsStore((s) => s.hapticsEnabled);

  const triggerJudgment = useCallback(
    async (judgment: Judgment) => {
      if (!enabled) return;
      try {
        switch (judgment) {
          case "perfect":
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case "great":
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case "good":
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case "miss":
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Error
            );
            break;
        }
      } catch {
        // Haptics not available
      }
    },
    [enabled]
  );

  const triggerButton = useCallback(async () => {
    if (!enabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics not available
    }
  }, [enabled]);

  const triggerComboMilestone = useCallback(async () => {
    if (!enabled) return;
    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    } catch {
      // Haptics not available
    }
  }, [enabled]);

  const triggerGameOver = useCallback(async () => {
    if (!enabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((r) => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((r) => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      // Haptics not available
    }
  }, [enabled]);

  return {
    triggerJudgment,
    triggerButton,
    triggerComboMilestone,
    triggerGameOver,
  };
}
