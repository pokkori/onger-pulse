export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  conditionType:
    | "total_score"
    | "max_combo"
    | "perfect_rate"
    | "songs_cleared"
    | "total_kills"
    | "no_miss"
    | "full_layer"
    | "play_count"
    | "boss_kill"
    | "specific_song";
  conditionValue: number;
  conditionSongId?: string;
  reward: {
    type: "skin" | "song" | "coins" | "title";
    id?: string;
    amount?: number;
  };
  platformAchievementId: {
    ios: string;
    android: string;
  };
  hidden: boolean;
}

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  unlocked: boolean;
  unlockedAt?: string;
}
