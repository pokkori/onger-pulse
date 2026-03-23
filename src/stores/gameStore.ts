import { create } from "zustand";
import { GamePhase, LayerState } from "../types/game-state";
import { Enemy } from "../types/enemy";
import { JudgmentResult } from "../types/judgment";
import { ComboManager } from "../engine/ComboManager";
import { CONFIG } from "../constants/config";

interface GameStoreState {
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
  lastJudgment: JudgmentResult | null;

  setPhase: (phase: GamePhase) => void;
  tick: (deltaMs: number) => void;
  addScore: (amount: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  addJudgment: (result: JudgmentResult) => void;
  setEnemies: (enemies: Enemy[]) => void;
  spawnEnemy: (enemy: Enemy) => void;
  removeEnemy: (enemyId: string) => void;
  damageEnemy: (enemyId: string, damage: number) => void;
  takeDamage: () => void;
  updateLayers: () => void;
  setCurrentSong: (songId: string) => void;
  setTotalNotes: (n: number) => void;
  reset: () => void;
}

const LAYER_NAMES = ["drums", "bass", "melody", "chorus", "fx"];

const defaultLayers: LayerState[] = LAYER_NAMES.map((name, i) => ({
  layerId: i,
  name,
  active: i === 0,
  currentVolume: i === 0 ? 0.8 : 0,
  targetVolume: i === 0 ? 0.8 : 0,
}));

export const useGameStore = create<GameStoreState>((set, get) => ({
  phase: "loading",
  elapsedMs: 0,
  deltaMs: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  comboMultiplier: 1.0,
  perfectCount: 0,
  greatCount: 0,
  goodCount: 0,
  missCount: 0,
  totalNotes: 0,
  life: CONFIG.INITIAL_LIFE,
  maxLife: CONFIG.MAX_LIFE,
  layers: [...defaultLayers],
  activeLayerCount: 1,
  enemies: [],
  killCount: 0,
  recentJudgments: [],
  currentSongId: "neon-rush",
  currentSkinId: "default",
  lastJudgment: null,

  setPhase: (phase) => set({ phase }),

  tick: (deltaMs) => {
    const state = get();
    set({
      elapsedMs: state.elapsedMs + deltaMs,
      deltaMs,
    });
  },

  addScore: (amount) => set((s) => ({ score: s.score + amount })),

  incrementCombo: () =>
    set((s) => {
      const newCombo = s.combo + 1;
      return {
        combo: newCombo,
        maxCombo: Math.max(s.maxCombo, newCombo),
        comboMultiplier: ComboManager.getMultiplier(newCombo),
      };
    }),

  resetCombo: () =>
    set({ combo: 0, comboMultiplier: 1.0 }),

  addJudgment: (result) =>
    set((s) => {
      const judgments = [result, ...s.recentJudgments].slice(0, 20);
      const counts: Partial<GameStoreState> = {};
      if (result.judgment === "perfect")
        counts.perfectCount = s.perfectCount + 1;
      else if (result.judgment === "great")
        counts.greatCount = s.greatCount + 1;
      else if (result.judgment === "good")
        counts.goodCount = s.goodCount + 1;
      else counts.missCount = s.missCount + 1;

      return {
        recentJudgments: judgments,
        lastJudgment: result,
        ...counts,
      };
    }),

  setEnemies: (enemies) => set({ enemies }),

  spawnEnemy: (enemy) =>
    set((s) => ({ enemies: [...s.enemies, enemy] })),

  removeEnemy: (enemyId) =>
    set((s) => ({
      enemies: s.enemies.filter((e) => e.id !== enemyId),
      killCount: s.killCount + 1,
    })),

  damageEnemy: (enemyId, damage) =>
    set((s) => ({
      enemies: s.enemies.map((e) =>
        e.id === enemyId ? { ...e, hp: e.hp - damage } : e
      ),
    })),

  takeDamage: () =>
    set((s) => {
      const newLife = s.life - 1;
      return {
        life: newLife,
        phase: newLife <= 0 ? "failed" : s.phase,
      };
    }),

  updateLayers: () =>
    set((s) => {
      const activeCount = ComboManager.getActiveLayerCount(s.combo);
      const layers = s.layers.map((layer, i) => ({
        ...layer,
        active: i < activeCount,
        targetVolume: i < activeCount ? 0.8 : 0,
      }));
      return { layers, activeLayerCount: activeCount };
    }),

  setCurrentSong: (songId) => set({ currentSongId: songId }),
  setTotalNotes: (n) => set({ totalNotes: n }),

  reset: () =>
    set({
      phase: "loading",
      elapsedMs: 0,
      deltaMs: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      comboMultiplier: 1.0,
      perfectCount: 0,
      greatCount: 0,
      goodCount: 0,
      missCount: 0,
      life: CONFIG.INITIAL_LIFE,
      layers: defaultLayers.map((l) => ({ ...l })),
      activeLayerCount: 1,
      enemies: [],
      killCount: 0,
      recentJudgments: [],
      lastJudgment: null,
    }),
}));
