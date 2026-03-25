import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_STREAK = 'onger_streak';
const KEY_LAST_PLAY = 'onger_last_play';

export async function updateStreak(): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const lastPlay = await AsyncStorage.getItem(KEY_LAST_PLAY);
  const current = parseInt((await AsyncStorage.getItem(KEY_STREAK)) || '0', 10);

  if (lastPlay === today) return current;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = lastPlay === yesterday ? current + 1 : 1;

  await AsyncStorage.setItem(KEY_STREAK, String(newStreak));
  await AsyncStorage.setItem(KEY_LAST_PLAY, today);
  return newStreak;
}

export async function getStreak(): Promise<number> {
  return parseInt((await AsyncStorage.getItem(KEY_STREAK)) || '0', 10);
}
