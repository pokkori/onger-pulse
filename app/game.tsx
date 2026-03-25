import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useGameStore } from "../src/stores/gameStore";
import { usePlayerStore } from "../src/stores/playerStore";
import { saveDailyChallengeResult } from "../src/lib/dailyChallenge";
import { useGameLoop } from "../src/hooks/useGameLoop";
import { useHaptics } from "../src/hooks/useHaptics";
import { GameEngine } from "../src/engine/GameEngine";
import { JudgmentSystem } from "../src/engine/JudgmentSystem";
import { ComboManager } from "../src/engine/ComboManager";
import { getBeatmapById } from "../src/data/beatmaps";
import { COLORS } from "../src/constants/colors";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y } from "../src/constants/layout";
import { CONFIG } from "../src/constants/config";
import { GameCanvas } from "../src/components/game/GameCanvas";
import { ScoreDisplay } from "../src/components/game/ScoreDisplay";
import { ComboDisplay } from "../src/components/game/ComboDisplay";
import { LayerIndicator } from "../src/components/game/LayerIndicator";
import { ProgressBar } from "../src/components/game/ProgressBar";
import { JudgmentEffect } from "../src/components/game/JudgmentEffect";
import { Modal } from "../src/components/ui/Modal";
import { Button } from "../src/components/ui/Button";
import { JUDGMENT_COMBO_CONTINUES } from "../src/types/judgment";
import { formatScore } from "../src/utils/format";

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ songId: string; isDaily?: string }>();
  const songId = params.songId || "neon-rush";
  const isDaily = params.isDaily === '1';

  const beatmap = getBeatmapById(songId);
  const engineRef = useRef<GameEngine | null>(null);

  // Game store
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);
  const combo = useGameStore((s) => s.combo);
  const comboMultiplier = useGameStore((s) => s.comboMultiplier);
  const life = useGameStore((s) => s.life);
  const maxLife = useGameStore((s) => s.maxLife);
  const enemies = useGameStore((s) => s.enemies);
  const layers = useGameStore((s) => s.layers);
  const elapsedMs = useGameStore((s) => s.elapsedMs);
  const lastJudgment = useGameStore((s) => s.lastJudgment);
  const killCount = useGameStore((s) => s.killCount);
  const perfectCount = useGameStore((s) => s.perfectCount);
  const greatCount = useGameStore((s) => s.greatCount);
  const goodCount = useGameStore((s) => s.goodCount);
  const missCount = useGameStore((s) => s.missCount);
  const maxCombo = useGameStore((s) => s.maxCombo);

  const setPhase = useGameStore((s) => s.setPhase);
  const setEnemies = useGameStore((s) => s.setEnemies);
  const spawnEnemy = useGameStore((s) => s.spawnEnemy);
  const removeEnemy = useGameStore((s) => s.removeEnemy);
  const damageEnemy = useGameStore((s) => s.damageEnemy);
  const addScore = useGameStore((s) => s.addScore);
  const incrementCombo = useGameStore((s) => s.incrementCombo);
  const resetCombo = useGameStore((s) => s.resetCombo);
  const addJudgment = useGameStore((s) => s.addJudgment);
  const takeDamage = useGameStore((s) => s.takeDamage);
  const updateLayers = useGameStore((s) => s.updateLayers);
  const tick = useGameStore((s) => s.tick);
  const reset = useGameStore((s) => s.reset);
  const setTotalNotes = useGameStore((s) => s.setTotalNotes);
  const setCurrentSong = useGameStore((s) => s.setCurrentSong);

  const { triggerJudgment, triggerButton } = useHaptics();

  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [judgmentKey, setJudgmentKey] = useState(0);

  // Countdown animation
  const countdownScale = useSharedValue(1);
  const countdownOpacity = useSharedValue(1);

  const countdownStyle = useAnimatedStyle(() => ({
    transform: [{ scale: countdownScale.value }],
    opacity: countdownOpacity.value,
  }));

  // Initialize
  useEffect(() => {
    if (!beatmap) return;

    reset();
    setCurrentSong(songId);
    setTotalNotes(beatmap.notes.length);

    const engine = new GameEngine(beatmap);
    engineRef.current = engine;

    // Start countdown
    setPhase("countdown");
    let count = 3;
    setCountdownNum(count);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownNum(count);
        countdownScale.value = withSequence(
          withTiming(2.0, { duration: 0 }),
          withTiming(1.0, { duration: 400 }),
          withTiming(0.5, { duration: 400 })
        );
        countdownOpacity.value = withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 300 })
        );
      } else if (count === 0) {
        setCountdownNum(0); // "GO!"
        countdownScale.value = withSequence(
          withTiming(2.0, { duration: 0 }),
          withTiming(1.0, { duration: 400 })
        );
        countdownOpacity.value = withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(0, { duration: 600 })
        );
      } else {
        clearInterval(interval);
        setCountdownNum(null);
        setPhase("playing");
      }
    }, CONFIG.COUNTDOWN_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [songId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Game loop
  const onTick = useCallback(
    (deltaMs: number) => {
      if (!engineRef.current || !beatmap) return;

      const state = useGameStore.getState();
      if (state.phase !== "playing") return;

      const result = engineRef.current.tick(
        deltaMs,
        state.enemies,
        state.combo
      );

      // Spawn new enemies
      for (const e of result.newEnemies) {
        spawnEnemy(e);
      }

      // Handle missed enemies (reached center)
      for (const e of result.missedEnemies) {
        removeEnemy(e.id);
        addJudgment({
          judgment: "miss",
          offsetMs: 0,
          enemyId: e.id,
          score: 0,
          tapPosition: { x: 0, y: 0 },
          timestamp: Date.now(),
        });
        resetCombo();
        takeDamage();
      }

      // Update surviving enemies positions
      setEnemies([
        ...result.updatedEnemies,
        ...useGameStore.getState().enemies.filter(
          (e) =>
            !result.updatedEnemies.find((u) => u.id === e.id) &&
            !result.missedEnemies.find((m) => m.id === e.id)
        ),
      ]);

      // Update layers
      updateLayers();

      // Advance time
      tick(deltaMs);

      // Check song completion
      const currentState = useGameStore.getState();
      if (
        engineRef.current.elapsedMs >= beatmap.durationMs &&
        currentState.enemies.length === 0
      ) {
        if (currentState.phase === "playing") {
          setPhase("cleared");
        }
      }
    },
    [beatmap] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useGameLoop(onTick, phase === "playing");

  // Handle tap
  const handleTap = useCallback(
    (event: GestureResponderEvent) => {
      if (phase !== "playing" || !beatmap || !engineRef.current) return;

      const { locationX, locationY } = event.nativeEvent;
      const tapX = locationX - SCREEN_CENTER_X;
      const tapY = locationY - SCREEN_CENTER_Y;

      const state = useGameStore.getState();
      const result = JudgmentSystem.judge(
        tapX,
        tapY,
        engineRef.current.elapsedMs,
        state.enemies,
        state.combo
      );

      if (!result) return;

      // Apply judgment
      addJudgment(result);
      addScore(result.score);
      setJudgmentKey((k) => k + 1);
      triggerJudgment(result.judgment);

      if (JUDGMENT_COMBO_CONTINUES[result.judgment]) {
        const prevCombo = state.combo;
        incrementCombo();
        const milestone = ComboManager.checkMilestone(
          prevCombo,
          prevCombo + 1
        );
        if (milestone) {
          // Combo milestone reached - could play SE here
        }

        // Damage enemy
        if (result.judgment !== "miss") {
          const target = state.enemies.find((e) => e.id === result.enemyId);
          if (target) {
            if (target.hp <= 1) {
              removeEnemy(target.id);
              // Spawn split children
              if (target.type === "split") {
                const children = JudgmentSystem.createSplitChildren(target);
                for (const child of children) {
                  spawnEnemy(child);
                }
              }
            } else {
              damageEnemy(target.id, 1);
            }
          }
        }
      } else {
        resetCombo();
        takeDamage();
      }
    },
    [phase, beatmap] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Navigate to result when game ends
  useEffect(() => {
    if (phase === "cleared" || phase === "failed") {
      const state = useGameStore.getState();
      const totalJudged =
        state.perfectCount +
        state.greatCount +
        state.goodCount +
        state.missCount;
      const perfectRate = totalJudged > 0 ? state.perfectCount / totalJudged : 0;

      // Save stats
      const playerStore = usePlayerStore.getState();
      playerStore.addStats(
        state.score,
        state.killCount,
        state.perfectCount,
        state.maxCombo
      );
      playerStore.incrementPlayCount();

      if (phase === "cleared") {
        const rank =
          perfectRate >= 0.9
            ? "S"
            : perfectRate >= 0.75
              ? "A"
              : perfectRate >= 0.6
                ? "B"
                : perfectRate >= 0.4
                  ? "C"
                  : "D";

        playerStore.updateBestScore(songId, {
          score: state.score,
          maxCombo: state.maxCombo,
          perfectRate,
          rank,
          clearedAt: new Date().toISOString(),
        });

        // Unlock next song
        if (songId === "neon-rush") playerStore.unlockSong("midnight-pulse");
        if (songId === "midnight-pulse") playerStore.unlockSong("cyber-storm");
      }

      playerStore.save();

      // デイリーチャレンジとして起動された場合はスコアを保存
      if (isDaily) {
        saveDailyChallengeResult(state.score).catch(() => {});
      }

      // Navigate after short delay
      const timer = setTimeout(() => {
        router.replace({
          pathname: "/result",
          params: {
            songId,
            score: String(state.score),
            maxCombo: String(state.maxCombo),
            perfectCount: String(state.perfectCount),
            greatCount: String(state.greatCount),
            goodCount: String(state.goodCount),
            missCount: String(state.missCount),
            killCount: String(state.killCount),
            cleared: phase === "cleared" ? "1" : "0",
            maxLayerCount: String(state.activeLayerCount),
          },
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!beatmap) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Song not found: {songId}</Text>
      </View>
    );
  }

  const progress = beatmap.durationMs > 0 ? elapsedMs / beatmap.durationMs : 0;
  const remainingMs = Math.max(0, beatmap.durationMs - elapsedMs);

  return (
    <View style={styles.container} onTouchStart={handleTap}>
      {/* Game canvas with enemies and pulse ring */}
      <GameCanvas
        enemies={enemies}
        bpm={beatmap.bpm}
        layers={layers}
      />

      {/* HUD overlay */}
      <View style={styles.hud}>
        <ScoreDisplay score={score} />
        <LayerIndicator layers={layers} />
        <ComboDisplay combo={combo} multiplier={comboMultiplier} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} remainingMs={remainingMs} />
      </View>

      {/* Life display */}
      <View style={styles.lifeContainer}>
        {Array.from({ length: maxLife }).map((_, i) => (
          <Text
            key={i}
            style={[
              styles.heart,
              { color: i < life ? COLORS.lifeActive : COLORS.lifeEmpty },
            ]}
          >
            {"\u2764"}
          </Text>
        ))}
      </View>

      {/* Pause button */}
      {phase === "playing" && (
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={() => {
            setPhase("paused");
            setShowPauseModal(true);
            triggerButton();
          }}
        >
          <Text style={styles.pauseIcon}>{"\u23F8"}</Text>
        </TouchableOpacity>
      )}

      {/* Judgment effect */}
      <View style={styles.judgmentContainer}>
        <JudgmentEffect
          judgment={lastJudgment?.judgment ?? null}
          triggerKey={judgmentKey}
        />
      </View>

      {/* Countdown */}
      {countdownNum !== null && (
        <View style={styles.countdownContainer}>
          <Animated.Text style={[styles.countdownText, countdownStyle]}>
            {countdownNum === 0 ? "GO!" : countdownNum}
          </Animated.Text>
        </View>
      )}

      {/* Game Over / Clear overlay */}
      {(phase === "cleared" || phase === "failed") && (
        <View style={styles.gameEndOverlay}>
          <Text
            style={[
              styles.gameEndText,
              { color: phase === "cleared" ? COLORS.accent : COLORS.miss },
            ]}
          >
            {phase === "cleared" ? "STAGE CLEAR" : "GAME OVER"}
          </Text>
          <Text style={styles.gameEndScore}>
            {formatScore(score)}
          </Text>
        </View>
      )}

      {/* Pause modal */}
      <Modal
        visible={showPauseModal}
        onClose={() => {
          setShowPauseModal(false);
          setPhase("playing");
        }}
      >
        <Text style={styles.pauseTitle}>PAUSED</Text>
        <View style={styles.pauseButtons}>
          <Button
            title={"\u25B6 RESUME"}
            onPress={() => {
              setShowPauseModal(false);
              setPhase("playing");
            }}
          />
          <Button
            title={"\u{1F504} RETRY"}
            variant="outline"
            onPress={() => {
              setShowPauseModal(false);
              router.replace({
                pathname: "/game",
                params: { songId },
              });
            }}
          />
          <Button
            title={"\u{1F3E0} QUIT"}
            variant="outline"
            onPress={() => {
              setShowPauseModal(false);
              router.replace("/");
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hud: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressContainer: {
    position: "absolute",
    top: 80,
    left: 16,
    right: 16,
  },
  lifeContainer: {
    position: "absolute",
    bottom: 40,
    left: 16,
    flexDirection: "row",
    gap: 4,
  },
  heart: {
    fontSize: 20,
  },
  pauseButton: {
    position: "absolute",
    bottom: 40,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  pauseIcon: {
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  judgmentContainer: {
    position: "absolute",
    bottom: "30%",
    alignSelf: "center",
  },
  countdownContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    fontSize: 96,
    fontWeight: "900",
    color: COLORS.primary,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  gameEndOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameEndText: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  gameEndScore: {
    fontSize: 28,
    color: COLORS.textPrimary,
    fontWeight: "700",
    marginTop: 12,
  },
  errorText: {
    color: COLORS.miss,
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  pauseTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.textPrimary,
    letterSpacing: 4,
    marginBottom: 24,
  },
  pauseButtons: {
    gap: 12,
    width: 200,
  },
});
