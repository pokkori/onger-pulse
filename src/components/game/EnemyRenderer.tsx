import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Enemy, EnemyType } from "../../types/enemy";
import { COLORS } from "../../constants/colors";
import { SCREEN_CENTER_X, SCREEN_CENTER_Y } from "../../constants/layout";

const ENEMY_COLORS: Record<EnemyType, string> = {
  normal: "#FF00FF",
  fast: "#00FFFF",
  heavy: "#FF4444",
  split: "#FFD700",
  boss: "#FF0000",
};

const ENEMY_LABELS: Record<EnemyType, string> = {
  normal: "\u{25CF}",
  fast: "\u{25C6}",
  heavy: "\u{25A0}",
  split: "\u{2726}",
  boss: "\u{2605}",
};

interface EnemyRendererProps {
  enemy: Enemy;
}

export function EnemyRenderer({ enemy }: EnemyRendererProps) {
  const size = enemy.hitRadius * 2;
  const color = ENEMY_COLORS[enemy.type];
  const screenX = SCREEN_CENTER_X + enemy.position.x - enemy.hitRadius;
  const screenY = SCREEN_CENTER_Y + enemy.position.y - enemy.hitRadius;

  return (
    <View
      style={[
        styles.enemy,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: screenX,
          top: screenY,
          borderColor: color,
          backgroundColor: `${color}33`,
          shadowColor: color,
        },
      ]}
    >
      <Text style={[styles.label, { color }]}>
        {ENEMY_LABELS[enemy.type]}
      </Text>
      {enemy.type === "heavy" || enemy.type === "boss" ? (
        <View style={styles.hpBar}>
          <View
            style={[
              styles.hpFill,
              {
                width: `${(enemy.hp / enemy.maxHp) * 100}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  enemy: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
  },
  hpBar: {
    position: "absolute",
    bottom: -6,
    width: "80%",
    height: 4,
    backgroundColor: COLORS.textMuted,
    borderRadius: 2,
  },
  hpFill: {
    height: "100%",
    borderRadius: 2,
  },
});
