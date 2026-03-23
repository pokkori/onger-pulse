import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../src/constants/colors";
import { ALL_BEATMAPS } from "../src/data/beatmaps";
import { usePlayerStore } from "../src/stores/playerStore";
import { useGameStore } from "../src/stores/gameStore";
import { Card } from "../src/components/ui/Card";
import { StarRating } from "../src/components/ui/StarRating";
import { Badge } from "../src/components/ui/Badge";
import { formatScore } from "../src/utils/format";

export default function SelectScreen() {
  const router = useRouter();
  const unlockedSongs = usePlayerStore((s) => s.unlockedSongs);
  const bestScores = usePlayerStore((s) => s.bestScores);
  const setCurrentSong = useGameStore((s) => s.setCurrentSong);

  const [selectedId, setSelectedId] = useState(
    useGameStore.getState().currentSongId
  );

  const handleStart = () => {
    setCurrentSong(selectedId);
    router.push({
      pathname: "/game",
      params: { songId: selectedId },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>{"\u2190"} BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SELECT SONG</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Song list */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {ALL_BEATMAPS.map((bm) => {
          const unlocked = unlockedSongs.includes(bm.id);
          const best = bestScores[bm.id];
          const isSelected = selectedId === bm.id;

          return (
            <TouchableOpacity
              key={bm.id}
              onPress={() => {
                if (unlocked) setSelectedId(bm.id);
              }}
              disabled={!unlocked}
              activeOpacity={0.8}
            >
              <Card
                selected={isSelected}
                style={[
                  styles.songCard,
                  !unlocked && styles.lockedCard,
                ]}
              >
                <View style={styles.songHeader}>
                  <Text style={styles.songTitle}>
                    {"\u{1F3B5}"} {bm.title}
                  </Text>
                  {!unlocked && (
                    <Badge text="LOCKED" color={COLORS.textMuted} />
                  )}
                </View>

                <View style={styles.songMeta}>
                  <Text style={styles.bpm}>BPM: {bm.bpm}</Text>
                  <StarRating
                    rating={Math.ceil(bm.difficulty / 2)}
                  />
                  <Text style={styles.diffLabel}>
                    {bm.difficultyLabel}
                  </Text>
                </View>

                {unlocked ? (
                  <View style={styles.songStats}>
                    <Text style={styles.statText}>
                      BEST: {best ? formatScore(best.score) : "--"}
                    </Text>
                    <Text style={styles.statText}>
                      RANK: {best ? best.rank : "--"}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.lockText}>
                    {"\u{1F512}"}{" "}
                    {bm.unlockCondition.type === "clear"
                      ? `Clear "${ALL_BEATMAPS.find((b) => b.id === bm.unlockCondition.requiredSongId)?.title}" first`
                      : "Purchase to unlock"}
                  </Text>
                )}

                {/* Layer dots */}
                {unlocked && (
                  <View style={styles.layerDots}>
                    {bm.layers.map((l) => (
                      <View
                        key={l.id}
                        style={[
                          styles.dot,
                          {
                            backgroundColor:
                              best && best.rank !== "D"
                                ? COLORS.layerActive
                                : COLORS.layerInactive,
                          },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Start button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          disabled={!unlockedSongs.includes(selectedId)}
        >
          <Text style={styles.startText}>
            {"\u25B6"}  START
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  songCard: {
    minHeight: 140,
  },
  lockedCard: {
    opacity: 0.4,
  },
  songHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  songTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  songMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  bpm: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  diffLabel: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: "700",
  },
  songStats: {
    flexDirection: "row",
    gap: 20,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  lockText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  layerDots: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
  },
  startButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  startText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 4,
  },
});
