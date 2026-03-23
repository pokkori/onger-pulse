import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getStorageValue<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

export async function setStorageValue<T>(
  key: string,
  value: T
): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function mergeStorageValue<T extends object>(
  key: string,
  partial: Partial<T>
): Promise<void> {
  await AsyncStorage.mergeItem(key, JSON.stringify(partial));
}
