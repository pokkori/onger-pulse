import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../../constants/colors";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y, PULSE_RING_RADIUS } from "../../constants/layout";

interface PulseRingProps {
  bpm: number;
  color?: string;
}

export function PulseRing({ bpm, color = COLORS.primary }: PulseRingProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);
  const beatMs = 60000 / bpm;

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: beatMs / 2, easing: Easing.out(Easing.ease) }),
        withTiming(1.0, { duration: beatMs / 2, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: beatMs / 2 }),
        withTiming(0.6, { duration: beatMs / 2 })
      ),
      -1,
      false
    );
  }, [bpm, beatMs, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          left: SCREEN_CENTER_X - PULSE_RING_RADIUS,
          top: SCREEN_CENTER_Y - PULSE_RING_RADIUS,
          borderColor: color,
          shadowColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    width: PULSE_RING_RADIUS * 2,
    height: PULSE_RING_RADIUS * 2,
    borderRadius: PULSE_RING_RADIUS,
    borderWidth: 3,
    backgroundColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 5,
  },
});
