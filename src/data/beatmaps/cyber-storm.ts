import { BeatMap, BeatNote } from "../../types";

function generateNotes(): BeatNote[] {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
  const notes: BeatNote[] = [];
  const beatMs = 60000 / 160; // 375ms per beat

  // Intro (0-36s): normal+fast alternating
  for (let i = 0; i < 48; i++) {
    const t = 2000 + i * beatMs * 2;
    if (t > 36000) break;
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: i % 2 === 0 ? "normal" : "fast",
      travelTimeMs: i % 2 === 0 ? 1800 : 1200,
    });
  }

  // Early (36-72s): 8 dirs, heavy pairs
  for (let i = 0; i < 50; i++) {
    const t = 36000 + i * beatMs * 1.4;
    if (t > 72000) break;
    const type = i % 10 === 0 ? "heavy" : i % 3 === 0 ? "fast" : "normal";
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: type,
      travelTimeMs: type === "heavy" ? 2200 : type === "fast" ? 1000 : 1300,
    });
  }

  // Mid (72-108s): split chains, 4 simultaneous, spiral
  for (let i = 0; i < 50; i++) {
    const t = 72000 + i * beatMs;
    if (t > 108000) break;
    const type = i % 6 === 0 ? "split" : i % 8 === 0 ? "heavy" : i % 2 === 0 ? "fast" : "normal";
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: type,
      travelTimeMs: type === "heavy" ? 2000 : type === "split" ? 1500 : type === "fast" ? 900 : 1100,
    });
  }

  // Late (108-144s): all random, 5 simultaneous, travelTime 800ms
  for (let i = 0; i < 40; i++) {
    const t = 108000 + i * beatMs * 0.9;
    if (t > 144000) break;
    const types = ["normal", "fast", "heavy", "split", "fast"] as const;
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: types[i % types.length],
      travelTimeMs: 800,
    });
  }

  // Climax (144-171s): max density
  for (let i = 0; i < 30; i++) {
    const t = 144000 + i * beatMs;
    if (t > 171000) break;
    notes.push({
      timeMs: Math.round(t),
      direction: dirs[i % 8],
      enemyType: i % 4 === 0 ? "split" : i % 3 === 0 ? "fast" : "normal",
      travelTimeMs: 800,
    });
  }

  // Boss (171-180s): 2 bosses + normal support
  notes.push(
    { timeMs: 171000, direction: "N", enemyType: "boss", travelTimeMs: 5000 },
    { timeMs: 171000, direction: "S", enemyType: "boss", travelTimeMs: 5000 },
    { timeMs: 173000, direction: "E", enemyType: "normal", travelTimeMs: 1000 },
    { timeMs: 174000, direction: "W", enemyType: "fast", travelTimeMs: 800 },
    { timeMs: 175000, direction: "NE", enemyType: "normal", travelTimeMs: 1000 },
    { timeMs: 176000, direction: "SW", enemyType: "fast", travelTimeMs: 800 },
    { timeMs: 177000, direction: "SE", enemyType: "normal", travelTimeMs: 1000 },
  );

  return notes.sort((a, b) => a.timeMs - b.timeMs);
}

const cyberStorm: BeatMap = {
  id: "cyber-storm",
  title: "Cyber Storm",
  artist: "Beat Pulse Original",
  bpm: 160,
  durationMs: 180000,
  difficulty: 9,
  difficultyLabel: "Expert",
  layers: [
    { id: 0, name: "drums", audioFile: "assets/audio/bgm/cyber-storm/drums.mp3", comboThreshold: 0, volume: 0.8 },
    { id: 1, name: "bass", audioFile: "assets/audio/bgm/cyber-storm/bass.mp3", comboThreshold: 5, volume: 0.0 },
    { id: 2, name: "melody", audioFile: "assets/audio/bgm/cyber-storm/melody.mp3", comboThreshold: 15, volume: 0.0 },
    { id: 3, name: "chorus", audioFile: "assets/audio/bgm/cyber-storm/chorus.mp3", comboThreshold: 30, volume: 0.0 },
    { id: 4, name: "fx", audioFile: "assets/audio/bgm/cyber-storm/fx.mp3", comboThreshold: 50, volume: 0.0 },
  ],
  unlockCondition: { type: "clear", requiredSongId: "midnight-pulse" },
  thumbnailImage: "assets/images/songs/cyber-storm-thumb.png",
  previewAudioFile: "assets/audio/bgm/cyber-storm/preview.mp3",
  notes: generateNotes(),
};

export default cyberStorm;
