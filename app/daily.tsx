import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { COLORS } from '../src/constants/colors';
import {
  getDailyBPM,
  getTodayChallenge,
  getDailyChallengeHistory,
  getChallengeStreak,
  DailyChallengeResult,
} from '../src/lib/dailyChallenge';

// SVG-like pulse icon rendered via View primitives (no emoji)
function PulseIcon({ color }: { color: string }) {
  return (
    <View style={[iconStyles.container]}>
      <View style={[iconStyles.outer, { borderColor: color }]} />
      <View style={[iconStyles.inner, { borderColor: color }]} />
      <View style={[iconStyles.dot, { backgroundColor: color }]} />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  container: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  outer: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
  },
  inner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

// Check mark via View
function CheckIcon({ color }: { color: string }) {
  return (
    <View style={checkStyles.wrapper}>
      <View style={[checkStyles.short, { backgroundColor: color }]} />
      <View style={[checkStyles.long, { backgroundColor: color }]} />
    </View>
  );
}

const checkStyles = StyleSheet.create({
  wrapper: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  short: { position: 'absolute', width: 2, height: 8, borderRadius: 1, left: 4, top: 8, transform: [{ rotate: '45deg' }] },
  long: { position: 'absolute', width: 2, height: 14, borderRadius: 1, right: 5, top: 3, transform: [{ rotate: '-45deg' }] },
});

// Calendar icon via View
function CalendarIcon({ color }: { color: string }) {
  return (
    <View style={calStyles.outer}>
      <View style={[calStyles.header, { backgroundColor: color }]} />
      <View style={calStyles.body}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[calStyles.dot, { backgroundColor: color }]} />
        ))}
      </View>
    </View>
  );
}

const calStyles = StyleSheet.create({
  outer: { width: 24, height: 24, borderRadius: 3, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  header: { height: 6, opacity: 0.8 },
  body: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 2, gap: 2 },
  dot: { width: 4, height: 4, borderRadius: 1, opacity: 0.7 },
});

export default function DailyChallengeScreen() {
  const router = useRouter();
  const todayBPM = getDailyBPM();
  const today = new Date().toISOString().slice(0, 10);

  const [todayResult, setTodayResult] = useState<DailyChallengeResult | null>(null);
  const [history, setHistory] = useState<DailyChallengeResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Animation values
  const bpmScale = useSharedValue(0);
  const bpmOpacity = useSharedValue(0);
  const bannerTranslateY = useSharedValue(30);
  const bannerOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);
  const buttonOpacity = useSharedValue(0);

  const bpmStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bpmScale.value }],
    opacity: bpmOpacity.value,
  }));

  const bannerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bannerTranslateY.value }],
    opacity: bannerOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  useEffect(() => {
    async function load() {
      const [result, hist, str] = await Promise.all([
        getTodayChallenge(),
        getDailyChallengeHistory(),
        getChallengeStreak(),
      ]);
      setTodayResult(result);
      setHistory(hist);
      setStreak(str);
      setLoading(false);
    }
    load();
  }, []);

  // Trigger pop-in animations after data loads
  useEffect(() => {
    if (loading) return;
    bpmScale.value = withSpring(1, { damping: 8, stiffness: 300 });
    bpmOpacity.value = withTiming(1, { duration: 300 });
    bannerTranslateY.value = withDelay(150, withSpring(0, { damping: 12, stiffness: 200 }));
    bannerOpacity.value = withDelay(150, withTiming(1, { duration: 300 }));
    buttonScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 200 }));
    buttonOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = useCallback(() => {
    router.push({
      pathname: '/game',
      params: { songId: 'neon-rush', dailyBPM: String(todayBPM), isDaily: '1' },
    });
  }, [router, todayBPM]);

  const handleShare = useCallback(async () => {
    if (!todayResult) return;
    const text = `音撃パルス デイリーBPM${todayResult.bpm}チャレンジ、${todayResult.score.toLocaleString()}点達成！ #音撃パルス #BPMチャレンジ`;
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({ text });
        }
      } else {
        await Share.share({ message: text });
      }
    } catch {
      // シェアキャンセルはサイレント
    }
  }, [todayResult]);

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  const isCompleted = todayResult !== null;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="戻る"
        accessibilityHint="前の画面に戻ります"
      >
        <View style={styles.backIcon}>
          <View style={[styles.backArrowShaft, { backgroundColor: COLORS.textPrimary }]} />
          <View style={[styles.backArrowHead, { borderRightColor: COLORS.textPrimary, borderBottomColor: COLORS.textPrimary }]} />
        </View>
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.headerBanner, bannerStyle]}>
          <Text style={styles.sectionLabel}>DAILY CHALLENGE</Text>
          <Text style={styles.dateText}>{today}</Text>
        </Animated.View>

        {/* BPM Display */}
        <View style={styles.bpmContainer}>
          <Text style={styles.bpmLabel}>TODAY'S BPM</Text>
          <Animated.Text style={[styles.bpmNumber, bpmStyle]}>
            {todayBPM}
          </Animated.Text>
          <View style={styles.bpmUnderline} />
        </View>

        {/* Streak badge */}
        {streak > 0 && (
          <Animated.View style={[styles.streakBadge, bannerStyle]}>
            <CalendarIcon color="#FFD93D" />
            <Text style={styles.streakText}>{streak}日連続チャレンジ中</Text>
          </Animated.View>
        )}

        {/* Today's result or start button */}
        <Animated.View style={[styles.actionArea, buttonStyle]}>
          {isCompleted ? (
            <View style={styles.completedCard}>
              <View style={styles.completedHeader}>
                <CheckIcon color="#2DD4BF" />
                <Text style={styles.completedLabel}>本日クリア済み</Text>
              </View>
              <Text style={styles.completedScore}>
                {todayResult.score.toLocaleString()}
              </Text>
              <Text style={styles.completedScoreLabel}>SCORE</Text>

              {/* Share button */}
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="結果をXでシェアする"
                accessibilityHint="スコアをXに投稿します"
              >
                <View style={styles.shareIconArea}>
                  <View style={[styles.xIconH, { backgroundColor: '#fff' }]} />
                  <View style={[styles.xIconV, { backgroundColor: '#fff' }]} />
                </View>
                <Text style={styles.shareButtonText}>Xでシェア</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStart}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="デイリーチャレンジを開始する"
              accessibilityHint={`BPM ${todayBPM}のチャレンジを開始します`}
            >
              <PulseIcon color="#1A1A2E" />
              <Text style={styles.startButtonText}>チャレンジ開始</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Recent history */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>RECENT HISTORY</Text>
            <View style={styles.historyList}>
              {history.slice(0, 7).map((item) => (
                <View
                  key={item.date}
                  style={[
                    styles.historyRow,
                    item.date === today && styles.historyRowToday,
                  ]}
                >
                  <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
                  <View style={styles.historyBpmBadge}>
                    <Text style={styles.historyBpm}>BPM {item.bpm}</Text>
                  </View>
                  <Text style={styles.historyScore}>
                    {item.score.toLocaleString()}
                  </Text>
                  {item.completed && (
                    <View style={styles.historyCheck}>
                      <CheckIcon color="#2DD4BF" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowShaft: {
    position: 'absolute',
    width: 14,
    height: 2,
    borderRadius: 1,
    right: 0,
  },
  backArrowHead: {
    position: 'absolute',
    left: 0,
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '135deg' }],
  },
  backText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerBanner: {
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD93D',
    letterSpacing: 4,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  bpmContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  bpmLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 4,
    marginBottom: 8,
    fontWeight: '600',
  },
  bpmNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: '#FFD93D',
    textShadowColor: '#FFD93D',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: -2,
  },
  bpmUnderline: {
    width: 80,
    height: 2,
    backgroundColor: '#FFD93D',
    borderRadius: 1,
    marginTop: 4,
    opacity: 0.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,217,61,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,217,61,0.25)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 24,
  },
  streakText: {
    color: '#FFD93D',
    fontSize: 14,
    fontWeight: '700',
  },
  actionArea: {
    width: '100%',
    marginBottom: 32,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: '#FFD93D',
    shadowColor: '#FFD93D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    color: '#1A1A2E',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  completedCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.3)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  completedLabel: {
    color: '#2DD4BF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  completedScore: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  completedScoreLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 3,
    marginTop: 2,
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  shareIconArea: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xIconH: {
    position: 'absolute',
    width: 18,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  xIconV: {
    position: 'absolute',
    width: 18,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  shareButtonText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  historySection: {
    width: '100%',
  },
  historyTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 12,
  },
  historyList: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    minHeight: 48,
  },
  historyRowToday: {
    borderColor: 'rgba(45,212,191,0.3)',
    backgroundColor: 'rgba(45,212,191,0.05)',
  },
  historyDate: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    width: 36,
  },
  historyBpmBadge: {
    backgroundColor: 'rgba(255,217,61,0.12)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,217,61,0.2)',
  },
  historyBpm: {
    color: '#FFD93D',
    fontSize: 12,
    fontWeight: '700',
  },
  historyScore: {
    flex: 1,
    textAlign: 'right',
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  historyCheck: {
    marginLeft: 4,
  },
});
