import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BestScore {
  score: number;
  maxCombo: number;
  perfectRate: number;
  rank: "S" | "A" | "B" | "C" | "D";
  clearedAt: string;
}

interface PlayerData {
  bestScores: Record<string, BestScore>;
  unlockedSongs: string[];
  unlockedSkins: string[];
  currentSkinId: string;
  totalScore: number;
  allTimeMaxCombo: number;
  totalKills: number;
  totalPerfects: number;
  playCount: number;
}

interface PlayerStore extends PlayerData {
  loaded: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  updateBestScore: (songId: string, data: BestScore) => void;
  unlockSong: (songId: string) => void;
  unlockSkin: (skinId: string) => void;
  setSkin: (skinId: string) => void;
  addStats: (score: number, kills: number, perfects: number, maxCombo: number) => void;
  incrementPlayCount: () => void;
}

const DEFAULT_DATA: PlayerData = {
  bestScores: {},
  unlockedSongs: ["neon-rush"],
  unlockedSkins: ["default"],
  currentSkinId: "default",
  totalScore: 0,
  allTimeMaxCombo: 0,
  totalKills: 0,
  totalPerfects: 0,
  playCount: 0,
};

const STORAGE_KEY = "@bp:player";

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...DEFAULT_DATA,
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as PlayerData;
        set({ ...data, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  save: async () => {
    const state = get();
    const data: PlayerData = {
      bestScores: state.bestScores,
      unlockedSongs: state.unlockedSongs,
      unlockedSkins: state.unlockedSkins,
      currentSkinId: state.currentSkinId,
      totalScore: state.totalScore,
      allTimeMaxCombo: state.allTimeMaxCombo,
      totalKills: state.totalKills,
      totalPerfects: state.totalPerfects,
      playCount: state.playCount,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  },

  updateBestScore: (songId, data) =>
    set((s) => {
      const existing = s.bestScores[songId];
      if (!existing || data.score > existing.score) {
        return {
          bestScores: { ...s.bestScores, [songId]: data },
        };
      }
      return {};
    }),

  unlockSong: (songId) =>
    set((s) => {
      if (s.unlockedSongs.includes(songId)) return {};
      return { unlockedSongs: [...s.unlockedSongs, songId] };
    }),

  unlockSkin: (skinId) =>
    set((s) => {
      if (s.unlockedSkins.includes(skinId)) return {};
      return { unlockedSkins: [...s.unlockedSkins, skinId] };
    }),

  setSkin: (skinId) => set({ currentSkinId: skinId }),

  addStats: (score, kills, perfects, maxCombo) =>
    set((s) => ({
      totalScore: s.totalScore + score,
      totalKills: s.totalKills + kills,
      totalPerfects: s.totalPerfects + perfects,
      allTimeMaxCombo: Math.max(s.allTimeMaxCombo, maxCombo),
    })),

  incrementPlayCount: () =>
    set((s) => ({ playCount: s.playCount + 1 })),
}));
