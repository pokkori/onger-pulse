import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  selected?: boolean;
}

export function Card({ children, style, selected = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        selected && styles.selected,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  selected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});
