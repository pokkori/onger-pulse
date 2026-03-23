import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Settings {
  bgmVolume: number;
  seVolume: number;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  timingOffset: number;
}

interface SettingsStore extends Settings {
  loaded: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  setBgmVolume: (v: number) => void;
  setSeVolume: (v: number) => void;
  setHapticsEnabled: (v: boolean) => void;
  setNotificationsEnabled: (v: boolean) => void;
  setTimingOffset: (v: number) => void;
}

const DEFAULT_SETTINGS: Settings = {
  bgmVolume: 0.8,
  seVolume: 1.0,
  hapticsEnabled: true,
  notificationsEnabled: true,
  timingOffset: 0,
};

const STORAGE_KEY = "@bp:settings";

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,
  loaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as Settings;
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
    const data: Settings = {
      bgmVolume: state.bgmVolume,
      seVolume: state.seVolume,
      hapticsEnabled: state.hapticsEnabled,
      notificationsEnabled: state.notificationsEnabled,
      timingOffset: state.timingOffset,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore
    }
  },

  setBgmVolume: (v) => set({ bgmVolume: v }),
  setSeVolume: (v) => set({ seVolume: v }),
  setHapticsEnabled: (v) => set({ hapticsEnabled: v }),
  setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
  setTimingOffset: (v) => set({ timingOffset: v }),
}));
