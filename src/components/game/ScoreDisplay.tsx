import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { formatScore } from "../../utils/format";

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <Text style={styles.score}>SCORE: {formatScore(score)}</Text>
  );
}

const styles = StyleSheet.create({
  score: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
