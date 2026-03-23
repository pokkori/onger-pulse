import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Text
          key={i}
          style={[
            styles.star,
            { color: i < rating ? COLORS.accent : COLORS.textMuted },
          ]}
        >
          {"\u2605"}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 2,
  },
  star: {
    fontSize: 14,
  },
});
