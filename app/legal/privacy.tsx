import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Pressable
          style={styles.back}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="戻る"
          accessibilityHint="前の画面に戻ります"
        >
          <Text style={styles.backText}>{'<'} 戻る</Text>
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title} accessibilityRole="header">プライバシーポリシー</Text>

          <Text style={styles.section}>1. 収集する情報</Text>
          <Text style={styles.body}>
            音撃パルスは、ゲームプレイデータ（スコア・コンボ・ストリーク）をデバイス内にのみ保存します。
            外部サーバーへの送信は行いません。
          </Text>

          <Text style={styles.section}>2. 使用する第三者サービス</Text>
          <Text style={styles.body}>
            {'- expo-notifications: ローカルプッシュ通知（外部送信なし）\n'}
            {'- expo-av: 音楽再生（デバイス内処理のみ）\n'}
            {'- expo-haptics: 触覚フィードバック（デバイス内処理のみ）\n'}
            {'- Expo SDK: アプリフレームワーク\n'}
            {'- AdMob (Google LLC): 広告配信のため使用。収集データはGoogleのプライバシーポリシーに準じます。'}
          </Text>

          <Text style={styles.section}>3. データの保管</Text>
          <Text style={styles.body}>
            スコア・進捗・設定データはデバイス内のAsyncStorageに保存されます。
            開発者がこれらのデータにアクセスすることはありません。
          </Text>

          <Text style={styles.section}>4. お子様のプライバシー</Text>
          <Text style={styles.body}>
            本アプリは13歳未満のお子様から意図的に個人情報を収集しません。
          </Text>

          <Text style={styles.section}>5. 本ポリシーの変更</Text>
          <Text style={styles.body}>
            本プライバシーポリシーは予告なく変更される場合があります。
            重要な変更はアプリのアップデートを通じてお知らせします。
          </Text>

          <Text style={styles.section}>6. お問い合わせ</Text>
          <Text style={styles.body}>support@example.com</Text>

          <Text style={styles.updated}>最終更新: 2025年12月1日</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { flex: 1 },
  back: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 20, paddingTop: 8 },
  backText: { color: '#60A5FA', fontSize: 16 },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 24 },
  section: { fontSize: 16, fontWeight: '700', color: '#00FFFF', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 14, color: '#D1D5DB', lineHeight: 22 },
  updated: { fontSize: 12, color: '#6B7280', marginTop: 32 },
});
