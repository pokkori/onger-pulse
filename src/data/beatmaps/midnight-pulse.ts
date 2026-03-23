import { BeatMap, BeatNote } from "../../types";

// Generate 150 notes for Midnight Pulse (BPM 140, 150s)
function generateNotes(): BeatNote[] {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
  const notes: BeatNote[] = [];
  const beatMs = 60000 / 140; // ~428ms per beat

  // Intro (0-30s): normal, 4 dirs, every 2 beats
  for (let i = 0; i < 35; i++) {
    const t = 3000 + i * beatMs * 2;
    if (t > 30000) break;
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 4 * 2],
      enemyType: "normal",
      travelTimeMs: 2000,
    });
  }

  // Early (30-60s): fast mixed, 8 dirs, alternating
  for (let i = 0; i < 40; i++) {
    const t = 30000 + i * beatMs * 1.5;
    if (t > 60000) break;
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: i % 3 === 0 ? "fast" : "normal",
      travelTimeMs: i % 3 === 0 ? 1200 : 1500,
    });
  }

  // Mid (60-90s): heavy + rotation
  for (let i = 0; i < 40; i++) {
    const t = 60000 + i * beatMs * 1.2;
    if (t > 90000) break;
    const type = i % 8 === 0 ? "heavy" : i % 4 === 0 ? "fast" : "normal";
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: type,
      travelTimeMs: type === "heavy" ? 2500 : type === "fast" ? 1100 : 1400,
    });
  }

  // Late (90-120s): split heavy, 3 simultaneous
  for (let i = 0; i < 30; i++) {
    const t = 90000 + i * beatMs;
    if (t > 120000) break;
    const type = i % 5 === 0 ? "split" : i % 7 === 0 ? "heavy" : i % 3 === 0 ? "fast" : "normal";
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: type,
      travelTimeMs: type === "heavy" ? 2200 : type === "split" ? 1600 : type === "fast" ? 900 : 1100,
    });
  }

  // Climax (120-142s): all types, 4 simultaneous
  for (let i = 0; i < 25; i++) {
    const t = 120000 + i * beatMs * 0.8;
    if (t > 142000) break;
    const types = ["normal", "fast", "heavy", "split", "fast", "normal", "fast", "normal"] as const;
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: types[i % types.length],
      travelTimeMs: 900,
    });
  }

  // Boss (142-150s)
  notes.push(
    { timeMs: 142000, direction: "N", enemyType: "boss", travelTimeMs: 4000 },
    { timeMs: 143000, direction: "E", enemyType: "fast", travelTimeMs: 800 },
    { timeMs: 144000, direction: "W", enemyType: "fast", travelTimeMs: 800 },
    { timeMs: 146000, direction: "S", enemyType: "normal", travelTimeMs: 1000 },
    { timeMs: 148000, direction: "NE", enemyType: "fast", travelTimeMs: 800 },
  );

  return notes.sort((a, b) => a.timeMs - b.timeMs);
}

const midnightPulse: BeatMap = {
  id: "midnight-pulse",
  title: "Midnight Pulse",
  artist: "Beat Pulse Original",
  bpm: 140,
  durationMs: 150000,
  difficulty: 6,
  difficultyLabel: "Hard",
  layers: [
    { id: 0, name: "drums", audioFile: "assets/audio/bgm/midnight-pulse/drums.mp3", comboThreshold: 0, volume: 0.8 },
    { id: 1, name: "bass", audioFile: "assets/audio/bgm/midnight-pulse/bass.mp3", comboThreshold: 5, volume: 0.0 },
    { id: 2, name: "melody", audioFile: "assets/audio/bgm/midnight-pulse/melody.mp3", comboThreshold: 15, volume: 0.0 },
    { id: 3, name: "chorus", audioFile: "assets/audio/bgm/midnight-pulse/chorus.mp3", comboThreshold: 30, volume: 0.0 },
    { id: 4, name: "fx", audioFile: "assets/audio/bgm/midnight-pulse/fx.mp3", comboThreshold: 50, volume: 0.0 },
  ],
  unlockCondition: { type: "clear", requiredSongId: "neon-rush" },
  thumbnailImage: "assets/images/songs/midnight-pulse-thumb.png",
  previewAudioFile: "assets/audio/bgm/midnight-pulse/preview.mp3",
  notes: generateNotes(),
};

export default midnightPulse;
