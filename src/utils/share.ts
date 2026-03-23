const SHARE_TEMPLATES = {
  clear: (score: number, rank: string, songTitle: string) =>
    `\u{1F3B5} ${songTitle} cleared!\n` +
    `Score: ${score.toLocaleString()} | Rank: ${rank}\n` +
    `#BeatPulse`,

  sRank: (score: number, songTitle: string) =>
    `\u{2728} S Rank achieved! \u{2728}\n` +
    `\u{1F3B5} ${songTitle}\n` +
    `Score: ${score.toLocaleString()}\n` +
    `#BeatPulse`,

  fullCombo: (combo: number, songTitle: string) =>
    `\u{1F525} Full Combo ${combo}! \u{1F525}\n` +
    `\u{1F3B5} ${songTitle}\n` +
    `#BeatPulse`,

  achievement: (achievementName: string) =>
    `\u{1F3C6} Achievement unlocked: "${achievementName}"\n` +
    `#BeatPulse`,
} as const;

export default SHARE_TEMPLATES;
