import { Judgment } from "../types/judgment";

/**
 * Sound effects manager.
 * In production, this would load and play wav/mp3 files via expo-av.
 * For now it's a stub that can be connected to real audio later.
 */
export class SoundEffects {
  static async playJudgment(_judgment: Judgment): Promise<void> {
    // In production: load and play tap-perfect.wav etc.
  }

  static async playComboMilestone(_milestone: number): Promise<void> {
    // In production: play combo-5.wav, combo-10.wav etc.
  }

  static async playLayerChange(_up: boolean): Promise<void> {
    // In production: play layer-up.wav or layer-down.wav
  }

  static async playEnemyExplode(): Promise<void> {
    // In production: play enemy-explode.wav
  }

  static async playStageClear(): Promise<void> {
    // In production: play stage-clear.wav
  }

  static async playGameOver(): Promise<void> {
    // In production: play game-over.wav
  }
}
