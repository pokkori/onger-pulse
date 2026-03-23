import { ComboManager } from "../engine/ComboManager";

/**
 * Manages volume levels for 5 BGM layers based on combo count.
 * In a real implementation, this controls Audio.Sound instances.
 * Here it tracks target/current volumes for the UI layer indicator.
 */
export class LayerMixer {
  private targetVolumes: number[] = [0.8, 0, 0, 0, 0];
  private currentVolumes: number[] = [0.8, 0, 0, 0, 0];

  updateVolumes(combo: number): number[] {
    const activeCount = ComboManager.getActiveLayerCount(combo);

    for (let i = 0; i < 5; i++) {
      this.targetVolumes[i] = i < activeCount ? 0.8 : 0;

      const fadeSpeed =
        this.targetVolumes[i] > this.currentVolumes[i]
          ? 0.002 // fade in
          : 0.0004; // fade out

      if (this.currentVolumes[i] < this.targetVolumes[i]) {
        this.currentVolumes[i] = Math.min(
          this.currentVolumes[i] + fadeSpeed,
          this.targetVolumes[i]
        );
      } else if (this.currentVolumes[i] > this.targetVolumes[i]) {
        this.currentVolumes[i] = Math.max(
          this.currentVolumes[i] - fadeSpeed,
          this.targetVolumes[i]
        );
      }
    }

    return [...this.currentVolumes];
  }

  getCurrentVolumes(): number[] {
    return [...this.currentVolumes];
  }

  reset(): void {
    this.targetVolumes = [0.8, 0, 0, 0, 0];
    this.currentVolumes = [0.8, 0, 0, 0, 0];
  }
}
