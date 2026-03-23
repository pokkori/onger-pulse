import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

interface ComboDisplayProps {
  combo: number;
  multiplier: number;
}

export function ComboDisplay({ combo, multiplier }: ComboDisplayProps) {
  if (combo === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.comboLabel}>COMBO</Text>
      <Text style={styles.comboNumber}>{combo}</Text>
      {multiplier > 1.0 && (
        <Text style={styles.multiplier}>x{multiplier.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  comboLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  comboNumber: {
    color: COLORS.secondary,
    fontSize: 28,
    fontWeight: "900",
  },
  multiplier: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});
