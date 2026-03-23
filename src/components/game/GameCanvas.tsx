import React from "react";
import { View, StyleSheet } from "react-native";
import { Enemy } from "../../types/enemy";
import { LayerState } from "../../types/game-state";
import { EnemyRenderer } from "./EnemyRenderer";
import { PulseRing } from "./PulseRing";
import { HitArea } from "./HitArea";
import { COLORS } from "../../constants/colors";

interface GameCanvasProps {
  enemies: Enemy[];
  bpm: number;
  layers: LayerState[];
  skinColor?: string;
}

export function GameCanvas({
  enemies,
  bpm,
  skinColor,
}: GameCanvasProps) {
  return (
    <View style={styles.canvas}>
      <HitArea />
      <PulseRing bpm={bpm} color={skinColor} />
      {enemies.map((enemy) => (
        <EnemyRenderer key={enemy.id} enemy={enemy} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
});
