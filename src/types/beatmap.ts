import { Direction, EnemyType } from "./enemy";

/** One BGM layer */
export interface BeatLayer {
  id: number;
  name: "drums" | "bass" | "melody" | "chorus" | "fx";
  audioFile: string;
  comboThreshold: number;
  volume: number;
}

/** One note in the beatmap (= one enemy spawn definition) */
export interface BeatNote {
  timeMs: number;
  direction: Direction;
  enemyType: EnemyType;
  travelTimeMs: number;
}

/** Full song definition */
export interface BeatMap {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  durationMs: number;
  difficulty: number;
  difficultyLabel: "Easy" | "Normal" | "Hard" | "Expert";
  layers: BeatLayer[];
  notes: BeatNote[];
  unlockCondition: {
    type: "default" | "clear" | "purchase";
    requiredSongId?: string;
    iapProductId?: string;
  };
  thumbnailImage: string;
  previewAudioFile: string;
}
