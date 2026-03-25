import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../src/constants/colors";
import { formatScore, formatPercent, getRank } from "../src/utils/format";
import { ScoreCard } from "../src/components/share/ScoreCard";
import { getBeatmapById } from "../src/data/beatmaps";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    songId: string;
    score: string;
    maxCombo: string;
    perfectCount: string;
    greatCount: string;
    goodCount: string;
    missCount: string;
    killCount: string;
    cleared: string;
    maxLayerCount: string;
  }>();

  const songId = params.songId || "neon-rush";
  const finalScore = parseInt(params.score || "0", 10);
  const maxCombo = parseInt(params.maxCombo || "0", 10);
  const perfect = parseInt(params.perfectCount || "0", 10);
  const great = parseInt(params.greatCount || "0", 10);
  const good = parseInt(params.goodCount || "0", 10);
  const miss = parseInt(params.missCount || "0", 10);
  const cleared = params.cleared === "1";
  const maxLayerCount = parseInt(params.maxLayerCount || "1", 10);

  const total = perfect + great + good + miss;
  const perfectRate = total > 0 ? perfect / total : 0;
  const rank = getRank(perfectRate);

  const beatmap = getBeatmapById(songId);

  // Count-up animation
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.floor(finalScore * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [finalScore]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text
        style={[
          styles.header,
          { color: cleared ? COLORS.accent : COLORS.miss },
        ]}
      >
        {cleared ? "\u2728 STAGE CLEAR \u2728" : "GAME OVER"}
      </Text>

      {/* Stats card */}
      <View style={styles.statsCard}>
        <StatRow label="SCORE" value={formatScore(displayScore)} />
        <StatRow label="MAX COMBO" value={String(maxCombo)} />
        <StatRow
          label="PERFECT"
          value={formatPercent(perfectRate)}
          color={COLORS.perfect}
        />
        <StatRow
          label="GREAT"
          value={total > 0 ? formatPercent(great / total) : "0%"}
          color={COLORS.great}
        />
        <StatRow
          label="GOOD"
          value={total > 0 ? formatPercent(good / total) : "0%"}
          color={COLORS.good}
        />
        <StatRow
          label="MISS"
          value={total > 0 ? formatPercent(miss / total) : "0%"}
          color={COLORS.miss}
        />

        {/* Layer indicator */}
        <View style={styles.layerRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.layerDot,
                {
                  backgroundColor:
                    i < maxLayerCount
                      ? COLORS.layerActive
                      : COLORS.layerInactive,
                },
              ]}
            />
          ))}
          <Text style={styles.layerText}>
            MAX LAYER: {maxLayerCount}/5
          </Text>
        </View>

        {/* Rank */}
        <View style={styles.rankContainer}>
          <Text style={styles.rankLabel}>RANK:</Text>
          <Text style={styles.rankValue}>{rank}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            router.replace({
              pathname: "/game",
              params: { songId },
            })
          }
          accessibilityRole="button"
          accessibilityLabel="もう一度プレイする"
        >
          <Text style={styles.retryText}>RETRY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleButton}
          onPress={() => router.replace("/")}
          accessibilityRole="button"
          accessibilityLabel="タイトル画面に戻る"
        >
          <Text style={styles.titleText}>TITLE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={statStyles.row}>
      <Text style={statStyles.label}>{label}</Text>
      <Text style={[statStyles.value, color ? { color } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 24,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
  },
  statsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  layerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  layerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  layerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 8,
  },
  rankContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  rankLabel: {
    color: COLORS.textSecondary,
    fontSize: 20,
    fontWeight: "700",
  },
  rankValue: {
    color: COLORS.accent,
    fontSize: 48,
    fontWeight: "900",
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  retryButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  retryText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
  },
  titleButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  titleText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
