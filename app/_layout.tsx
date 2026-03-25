import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { usePlayerStore } from "../src/stores/playerStore";
import { useSettingsStore } from "../src/stores/settingsStore";
import { COLORS } from "../src/constants/colors";
import { scheduleDailyReminder } from "../src/lib/notifications";

export default function RootLayout() {
  const loadPlayer = usePlayerStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);

  useEffect(() => {
    loadPlayer();
    loadSettings();
    scheduleDailyReminder().catch(() => {});
  }, [loadPlayer, loadSettings]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: "fade",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
