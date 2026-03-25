import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  // メインリマインダー: 毎日20:00
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '音撃パルス',
      body: '今日もリズムを刻もう! ストリーク継続中',
      sound: true,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, hour: 20, minute: 0, repeats: true },
  });
}

export async function scheduleStreakMilestoneNotification(days: number): Promise<void> {
  if (Platform.OS === 'web') return;
  const milestones: Record<number, string> = {
    3:  '3日連続達成! リズム感が身についてきた',
    7:  '1週間連続! あなたは本物のビートマスター',
    14: '2週間連続! このまま止まらないで',
    30: '30日連続達成! 伝説のプレイヤーだ',
  };
  const body = milestones[days];
  if (!body) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${days}日連続達成!`,
      body,
      sound: true,
    },
    trigger: null,
  });
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
