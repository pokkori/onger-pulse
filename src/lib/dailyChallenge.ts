import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_DAILY_RESULT = 'onger_daily_challenge_result';
const KEY_DAILY_HISTORY = 'onger_daily_challenge_history';
const KEY_CHALLENGE_STREAK = 'onger_challenge_streak';
const KEY_CHALLENGE_STREAK_DATE = 'onger_challenge_streak_date';

const BPM_OPTIONS = [80, 90, 100, 110, 120, 130, 140, 150, 160];

/** 日付をシードにして今日のBPMを決定（毎日同じBPMが返る） */
export function getDailyBPM(): number {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  return BPM_OPTIONS[seed % BPM_OPTIONS.length];
}

/** 今日の日付文字列 (YYYY-MM-DD) */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface DailyChallengeResult {
  date: string;
  bpm: number;
  score: number;
  completed: boolean;
}

/** 今日のチャレンジ結果を取得（未プレイはnull） */
export async function getTodayChallenge(): Promise<DailyChallengeResult | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY_DAILY_RESULT);
    if (!raw) return null;
    const result: DailyChallengeResult = JSON.parse(raw);
    if (result.date !== getTodayDateString()) return null;
    return result;
  } catch {
    return null;
  }
}

/** デイリーチャレンジ結果を保存し、チャレンジストリークを更新 */
export async function saveDailyChallengeResult(score: number): Promise<void> {
  const today = getTodayDateString();
  const bpm = getDailyBPM();

  const result: DailyChallengeResult = {
    date: today,
    bpm,
    score,
    completed: true,
  };

  await AsyncStorage.setItem(KEY_DAILY_RESULT, JSON.stringify(result));

  // 履歴に追加（最新30件まで）
  const history = await getDailyChallengeHistory();
  const exists = history.some((h) => h.date === today);
  if (!exists) {
    const updated = [result, ...history].slice(0, 30);
    await AsyncStorage.setItem(KEY_DAILY_HISTORY, JSON.stringify(updated));
  }

  // チャレンジ専用ストリーク更新
  await updateChallengeStreak();
}

/** デイリーチャレンジ履歴を取得 */
export async function getDailyChallengeHistory(): Promise<DailyChallengeResult[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY_DAILY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** デイリーチャレンジ専用ストリーク日数を取得 */
export async function getChallengeStreak(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEY_CHALLENGE_STREAK);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

async function updateChallengeStreak(): Promise<void> {
  const today = getTodayDateString();
  const lastDate = await AsyncStorage.getItem(KEY_CHALLENGE_STREAK_DATE);
  const current = await getChallengeStreak();

  if (lastDate === today) return; // 今日すでに完了済み

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let newStreak: number;

  if (lastDate === yesterday) {
    newStreak = current + 1;
  } else if (lastDate) {
    newStreak = 1; // 途切れてリセット
  } else {
    newStreak = 1; // 初回
  }

  await AsyncStorage.setItem(KEY_CHALLENGE_STREAK, String(newStreak));
  await AsyncStorage.setItem(KEY_CHALLENGE_STREAK_DATE, today);
}
