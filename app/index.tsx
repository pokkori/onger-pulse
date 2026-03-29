import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
// Pressable replaces Pressable per design standard 2026
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../src/constants/colors";
import { useGameStore } from "../src/stores/gameStore";
import { updateStreak, getStreak } from "../src/lib/streak";
import { getDailyBPM, getTodayChallenge } from "../src/lib/dailyChallenge";
import WelcomeBackModal, { checkWelcomeBack } from "../src/components/WelcomeBackModal";

export default function TitleScreen() {
  const router = useRouter();
  const currentSongId = useGameStore((s) => s.currentSongId);
  const [streak, setStreak] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const todayBPM = getDailyBPM();
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeResult, setWelcomeResult] = useState<{ shouldShow: boolean; hoursAway: number; bonusCoins: number; message: string }>({ shouldShow: false, hoursAway: 0, bonusCoins: 0, message: '' });

  useEffect(() => {
    // タイトル画面表示時にストリーク更新
    updateStreak().then(setStreak).catch(() => getStreak().then(setStreak).catch(() => {}));
    // デイリーチャレンジ完了状態を確認
    getTodayChallenge().then((result) => setDailyCompleted(result !== null)).catch(() => {});
    // 復帰モーダルチェック
    checkWelcomeBack().then((r) => { if (r.shouldShow) { setWelcomeResult(r); setWelcomeVisible(true); } });
  }, []);

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

  // Daily banner pop-in
  const bannerScale = useSharedValue(0.9);
  const bannerOpacity = useSharedValue(0);

  useEffect(() => {
    bannerScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    bannerOpacity.value = withTiming(1, { duration: 400 });
  }, [bannerScale, bannerOpacity]);

  const bannerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bannerScale.value }],
    opacity: bannerOpacity.value,
  }));

  return (
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={styles.container}>
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

      {/* Daily Challenge Banner */}
      <Animated.View style={[styles.dailyBannerWrapper, bannerAnimStyle]}>
        <Pressable
          style={[
            styles.dailyBanner,
            dailyCompleted && styles.dailyBannerCompleted,
          ]}
          onPress={() => router.push('/daily')}

          accessibilityRole="button"
          accessibilityLabel={`デイリーチャレンジ、今日のBPM${todayBPM}`}
          accessibilityHint="デイリーチャレンジ画面に移動します"
        >
          <View style={styles.dailyBannerLeft}>
            <Text style={styles.dailyBannerLabel}>DAILY CHALLENGE</Text>
            <Text style={styles.dailyBannerBPM}>BPM {todayBPM}</Text>
          </View>
          {dailyCompleted ? (
            <View style={styles.completedBadge}>
              <View style={styles.checkShort} />
              <View style={styles.checkLong} />
              <Text style={styles.completedBadgeText}>完了</Text>
            </View>
          ) : (
            <View style={styles.dailyArrow}>
              <View style={[styles.arrowLine, { backgroundColor: '#FFD93D' }]} />
              <View style={[styles.arrowHead, { borderLeftColor: '#FFD93D', borderBottomColor: '#FFD93D' }]} />
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable
          style={styles.playButton}
          onPress={() =>
            router.push({
              pathname: "/game",
              params: { songId: currentSongId },
            })
          }

          accessibilityRole="button"
          accessibilityLabel="ゲームをプレイする"
          accessibilityHint="選択中の曲でゲームを開始します"
        >
          <Text style={styles.playText}>{"\u25B6"}  PLAY</Text>
        </Pressable>

        <Pressable
          style={styles.outlineButton}
          onPress={() => router.push("/select")}

          accessibilityRole="button"
          accessibilityLabel="曲を選択する"
        >
          <Text style={styles.outlineText}>SELECT</Text>
        </Pressable>

        <Pressable
          style={styles.outlineButton}
          onPress={() => router.push("/shop")}

          accessibilityRole="button"
          accessibilityLabel="ショップを開く"
        >
          <Text style={styles.outlineText}>SHOP</Text>
        </Pressable>
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        {streak > 0 && (
          <View
            style={styles.streakBadge}
            accessibilityRole="text"
            accessibilityLabel={`連続プレイ${streak}日`}
          >
            <Text style={styles.streakText}>{streak}日連続</Text>
          </View>
        )}
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
      <WelcomeBackModal
        visible={welcomeVisible}
        result={welcomeResult}
        onClose={() => setWelcomeVisible(false)}
      />
    </LinearGradient>
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
    marginBottom: 24,
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
  dailyBannerWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  dailyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,217,61,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,217,61,0.3)',
  },
  dailyBannerCompleted: {
    backgroundColor: 'rgba(45,212,191,0.06)',
    borderColor: 'rgba(45,212,191,0.3)',
  },
  dailyBannerLeft: {
    gap: 2,
  },
  dailyBannerLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 3,
  },
  dailyBannerBPM: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFD93D',
    letterSpacing: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(45,212,191,0.15)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.4)',
  },
  checkShort: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#2DD4BF',
    borderRadius: 1,
    left: 8,
    top: 10,
    transform: [{ rotate: '45deg' }],
  },
  checkLong: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#2DD4BF',
    borderRadius: 1,
    right: 26,
    top: 4,
    transform: [{ rotate: '-45deg' }],
  },
  completedBadgeText: {
    color: '#2DD4BF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 18,
  },
  dailyArrow: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLine: {
    position: 'absolute',
    width: 16,
    height: 2,
    borderRadius: 1,
    right: 6,
  },
  arrowHead: {
    position: 'absolute',
    right: 6,
    width: 8,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-135deg' }],
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
  streakBadge: {
    backgroundColor: 'rgba(255,200,0,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,200,0,0.4)',
    marginBottom: 4,
  },
  streakText: {
    color: '#FFD93D',
    fontSize: 12,
    fontWeight: '700',
  },
});
