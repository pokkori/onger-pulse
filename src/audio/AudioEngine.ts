import { Audio } from "expo-av";

/**
 * Audio engine wrapper around expo-av.
 * Manages BGM layers and SE playback.
 */
export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private initialized = false;

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.initialized = true;
    } catch {
      // Audio init may fail in web/test environments
    }
  }

  async cleanup(): Promise<void> {
    this.initialized = false;
  }
}

export default AudioEngine;
