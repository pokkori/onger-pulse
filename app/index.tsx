import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../src/constants/colors";
import { useGameStore } from "../src/stores/gameStore";

export default function TitleScreen() {
  const router = useRouter();
  const currentSongId = useGameStore((s) => s.currentSongId);

  // Logo pulse animation (BPM 120 = 500ms per beat)
  const logoScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(1.0, {
          duration: 500,
          easing: Easing.in(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [logoScale]);

  const logoAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  // Pulse ring animation
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.6);

  useEffect(() => {
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 500 }),
        withTiming(1.0, { duration: 500 })
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 500 }),
        withTiming(0.3, { duration: 500 })
      ),
      -1,
      false
    );
  }, [ringScale, ringOpacity]);

  const ringAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Logo area */}
      <View style={styles.logoArea}>
        <Animated.View style={logoAnimStyle}>
          <Text style={styles.titleJp}>BEAT PULSE</Text>
          <Text style={styles.subtitle}>BEAT PULSE</Text>
        </Animated.View>
      </View>

      {/* Pulse ring */}
      <View style={styles.ringContainer}>
        <Animated.View style={[styles.ring, ringAnimStyle]} />
        <Animated.View style={[styles.ringInner, ringAnimStyle]} />
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() =>
            router.push({
              pathname: "/game",
              params: { songId: currentSongId },
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.playText}>{"\u25B6"}  PLAY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/select")}
          activeOpacity={0.8}
        >
          <Text style={styles.outlineText}>{"\u{1F3B5}"}  SELECT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.push("/shop")}
          activeOpacity={0.8}
        >
          <Text style={styles.outlineText}>{"\u{1F6D2}"}  SHOP</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoArea: {
    marginBottom: 20,
    alignItems: "center",
  },
  titleJp: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 4,
    textAlign: "center",
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    letterSpacing: 8,
    textAlign: "center",
    marginTop: 4,
  },
  ringContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  ring: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  ringInner: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttons: {
    width: "100%",
    gap: 12,
  },
  playButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  playText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
  },
  outlineButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 3,
  },
  bottomBar: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  versionText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
