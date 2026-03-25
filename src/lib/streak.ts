import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_STREAK = 'onger_streak';
const KEY_LAST_PLAY = 'onger_last_play';
const KEY_FREEZE_COUNT = 'onger_freeze_count';
const KEY_LAST_FREEZE_DATE = 'onger_last_freeze_date';

export interface StreakData {
  streak: number;
  lastPlayDate: string;
  freezeCount: number;
  lastFreezeDate: string;
}

export async function updateStreak(): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const lastPlay = await AsyncStorage.getItem(KEY_LAST_PLAY);
  const current = parseInt((await AsyncStorage.getItem(KEY_STREAK)) || '0', 10);

  if (lastPlay === today) return current;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // ストリーク継続チェック（通常）
  if (lastPlay === yesterday) {
    const newStreak = current + 1;
    await AsyncStorage.setItem(KEY_STREAK, String(newStreak));
    await AsyncStorage.setItem(KEY_LAST_PLAY, today);
    return newStreak;
  }

  // 1日空いた場合: フリーズを消費できるか確認
  const dayBeforeYesterday = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
  if (lastPlay === dayBeforeYesterday) {
    const freezeCount = await getFreezeCount();
    if (freezeCount > 0) {
      // フリーズ消費: ストリーク継続
      await AsyncStorage.setItem(KEY_FREEZE_COUNT, String(freezeCount - 1));
      await AsyncStorage.setItem(KEY_LAST_FREEZE_DATE, today);
      const newStreak = current + 1;
      await AsyncStorage.setItem(KEY_STREAK, String(newStreak));
      await AsyncStorage.setItem(KEY_LAST_PLAY, today);
      return newStreak;
    }
  }

  // リセット
  await AsyncStorage.setItem(KEY_STREAK, '1');
  await AsyncStorage.setItem(KEY_LAST_PLAY, today);
  return 1;
}

export async function getStreak(): Promise<number> {
  return parseInt((await AsyncStorage.getItem(KEY_STREAK)) || '0', 10);
}

export async function getFreezeCount(): Promise<number> {
  return parseInt((await AsyncStorage.getItem(KEY_FREEZE_COUNT)) || '0', 10);
}

export async function getLastFreezeDate(): Promise<string> {
  return (await AsyncStorage.getItem(KEY_LAST_FREEZE_DATE)) || '';
}

/** D7達成時にフリーズを付与（1個まで） */
export async function awardFreezeIfEligible(streak: number): Promise<boolean> {
  if (streak < 7) return false;
  const current = await getFreezeCount();
  if (current >= 1) return false; // 最大1個
  await AsyncStorage.setItem(KEY_FREEZE_COUNT, '1');
  return true;
}

export async function getStreakData(): Promise<StreakData> {
  const [streak, lastPlayDate, freezeCount, lastFreezeDate] = await Promise.all([
    AsyncStorage.getItem(KEY_STREAK),
    AsyncStorage.getItem(KEY_LAST_PLAY),
    AsyncStorage.getItem(KEY_FREEZE_COUNT),
    AsyncStorage.getItem(KEY_LAST_FREEZE_DATE),
  ]);
  return {
    streak: parseInt(streak || '0', 10),
    lastPlayDate: lastPlayDate || '',
    freezeCount: parseInt(freezeCount || '0', 10),
    lastFreezeDate: lastFreezeDate || '',
  };
}
