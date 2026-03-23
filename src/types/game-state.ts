import { JudgmentResult } from "./judgment";
import { Enemy } from "./enemy";

/** Game phase */
export type GamePhase =
  | "loading"
  | "countdown"
  | "playing"
  | "paused"
  | "cleared"
  | "failed";

/** BGM layer runtime state */
export interface LayerState {
  layerId: number;
  name: string;
  active: boolean;
  currentVolume: number;
  targetVolume: number;
}

/** Game state (Zustand store shape) */
export interface GameState {
  phase: GamePhase;
  elapsedMs: number;
  deltaMs: number;
  score: number;
  combo: number;
  maxCombo: number;
  comboMultiplier: number;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  missCount: number;
  totalNotes: number;
  life: number;
  maxLife: number;
  layers: LayerState[];
  activeLayerCount: number;
  enemies: Enemy[];
  killCount: number;
  recentJudgments: JudgmentResult[];
  currentSongId: string;
  currentSkinId: string;

  setPhase: (phase: GamePhase) => void;
  tick: (deltaMs: number) => void;
  addScore: (amount: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  addJudgment: (result: JudgmentResult) => void;
  spawnEnemy: (enemy: Enemy) => void;
  removeEnemy: (enemyId: string) => void;
  damageEnemy: (enemyId: string, damage: number) => void;
  takeDamage: () => void;
  updateLayers: () => void;
  reset: () => void;
}
