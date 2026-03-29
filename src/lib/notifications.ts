// SDK55ではExpo Goでexpo-notificationsが非対応のため全機能を無効化

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleDailyReminder(): Promise<void> {
  // SDK55では非対応 - no-op
}

export async function scheduleDailyChallengeNotification(): Promise<void> {
  // SDK55では非対応 - no-op
}

export async function scheduleStreakMilestoneNotification(_days: number): Promise<void> {
  // SDK55では非対応 - no-op
}

export async function cancelAllReminders(): Promise<void> {
  // SDK55では非対応 - no-op
}
