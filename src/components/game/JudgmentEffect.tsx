import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { Judgment } from "../../types/judgment";
import { COLORS } from "../../constants/colors";

const JUDGMENT_TEXT: Record<Judgment, string> = {
  perfect: "PERFECT",
  great: "GREAT",
  good: "GOOD",
  miss: "MISS",
};

const JUDGMENT_COLOR: Record<Judgment, string> = {
  perfect: COLORS.perfect,
  great: COLORS.great,
  good: COLORS.good,
  miss: COLORS.miss,
};

interface JudgmentEffectProps {
  judgment: Judgment | null;
  triggerKey: number;
}

export function JudgmentEffect({ judgment, triggerKey }: JudgmentEffectProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!judgment) return;
    setVisible(true);
    scale.value = withSequence(
      withTiming(1.5, { duration: 0 }),
      withTiming(1.0, { duration: 200 })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 0 }),
      withTiming(1, { duration: 300 }),
      withTiming(0, { duration: 200 }, () => {
        runOnJS(setVisible)(false);
      })
    );
  }, [triggerKey, judgment, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible || !judgment) return null;

  return (
    <Animated.Text
      style={[
        styles.text,
        { color: JUDGMENT_COLOR[judgment] },
        animatedStyle,
      ]}
    >
      {JUDGMENT_TEXT[judgment]}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 4,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
