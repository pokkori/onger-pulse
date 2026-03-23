import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

/**
 * ReplayCapture placeholder - v1.1 feature.
 * In production, captures the last 15 seconds of gameplay.
 */
export function ReplayCapture() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Replay (v1.1)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    opacity: 0.5,
  },
  text: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
