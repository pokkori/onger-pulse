import { BeatMap } from "../../types";
import neonRush from "./neon-rush";
import midnightPulse from "./midnight-pulse";
import cyberStorm from "./cyber-storm";

export const ALL_BEATMAPS: BeatMap[] = [neonRush, midnightPulse, cyberStorm];

export function getBeatmapById(id: string): BeatMap | undefined {
  return ALL_BEATMAPS.find((bm) => bm.id === id);
}

export { neonRush, midnightPulse, cyberStorm };
