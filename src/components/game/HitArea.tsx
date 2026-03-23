import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y, PULSE_RING_RADIUS } from "../../constants/layout";
import { CONFIG } from "../../constants/config";

export function HitArea() {
  const totalRadius = PULSE_RING_RADIUS + CONFIG.TAP_MARGIN;
  return (
    <View
      style={[
        styles.area,
        {
          width: totalRadius * 2,
          height: totalRadius * 2,
          borderRadius: totalRadius,
          left: SCREEN_CENTER_X - totalRadius,
          top: SCREEN_CENTER_Y - totalRadius,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  area: {
    position: "absolute",
    borderWidth: 1,
    borderColor: `${COLORS.primary}22`,
    backgroundColor: "transparent",
  },
});
