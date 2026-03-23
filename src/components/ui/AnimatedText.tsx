import React, { useEffect } from "react";
import { StyleSheet, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { COLORS } from "../../constants/colors";

interface AnimatedTextProps {
  text: string;
  color?: string;
  style?: TextStyle;
}

export function AnimatedText({
  text,
  color = COLORS.textPrimary,
  style,
}: AnimatedTextProps) {
  const scale = useSharedValue(1.5);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.5, { duration: 0 }),
      withTiming(1.0, { duration: 200 })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 200 })
    );
  }, [text, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[styles.text, { color }, animatedStyle, style]}
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
