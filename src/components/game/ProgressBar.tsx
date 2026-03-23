import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { formatTime } from "../../utils/timing";

interface ProgressBarProps {
  progress: number;
  remainingMs: number;
}

export function ProgressBar({ progress, remainingMs }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View
          style={[styles.fill, { width: `${Math.min(progress * 100, 100)}%` }]}
        />
      </View>
      <Text style={styles.time}>{formatTime(remainingMs)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.textMuted,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
  },
});
