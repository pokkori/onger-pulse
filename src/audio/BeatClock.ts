/**
 * BPM-synchronized clock.
 * Tracks elapsed time and provides beat-aligned timing.
 */
export class BeatClock {
  private bpm: number;
  public elapsedMs: number = 0;

  constructor(bpm: number) {
    this.bpm = bpm;
  }

  /** Milliseconds per beat */
  get msPerBeat(): number {
    return 60000 / this.bpm;
  }

  /** Current beat number (0-indexed) */
  get currentBeat(): number {
    return Math.floor(this.elapsedMs / this.msPerBeat);
  }

  /** Progress within current beat (0-1) */
  get beatProgress(): number {
    return (this.elapsedMs % this.msPerBeat) / this.msPerBeat;
  }

  advance(deltaMs: number): void {
    this.elapsedMs += deltaMs;
  }

  reset(): void {
    this.elapsedMs = 0;
  }
}
