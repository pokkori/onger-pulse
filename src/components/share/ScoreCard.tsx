import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { formatScore, formatPercent } from "../../utils/format";

interface ScoreCardProps {
  score: number;
  rank: string;
  maxCombo: number;
  perfectRate: number;
  songTitle: string;
  bpm: number;
  maxLayerCount: number;
}

export function ScoreCard({
  score,
  rank,
  maxCombo,
  perfectRate,
  songTitle,
  bpm,
  maxLayerCount,
}: ScoreCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.logo}>BEAT PULSE</Text>
      <View style={styles.row}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{formatScore(score)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>RANK</Text>
        <Text style={[styles.value, styles.rank]}>{rank}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>COMBO</Text>
        <Text style={styles.value}>{maxCombo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>PERFECT</Text>
        <Text style={styles.value}>{formatPercent(perfectRate)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>LAYERS</Text>
        <Text style={styles.value}>{maxLayerCount}/5</Text>
      </View>
      <Text style={styles.songInfo}>
        {songTitle} (BPM {bpm})
      </Text>
      <Text style={styles.hashtag}>#BeatPulse</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    padding: 24,
    backgroundColor: "#0A0A1A",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  rank: {
    color: COLORS.accent,
    fontSize: 24,
  },
  songInfo: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
  hashtag: {
    color: COLORS.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});
