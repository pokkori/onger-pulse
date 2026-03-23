import React from "react";
import { View, StyleSheet } from "react-native";
import { LayerState } from "../../types/game-state";
import { COLORS } from "../../constants/colors";

interface LayerIndicatorProps {
  layers: LayerState[];
}

export function LayerIndicator({ layers }: LayerIndicatorProps) {
  return (
    <View style={styles.container}>
      {layers.map((layer) => (
        <View
          key={layer.layerId}
          style={[
            styles.dot,
            {
              backgroundColor: layer.active
                ? COLORS.layerActive
                : COLORS.layerInactive,
              shadowColor: layer.active ? COLORS.layerActive : "transparent",
              shadowOpacity: layer.active ? 0.8 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 3,
  },
});
