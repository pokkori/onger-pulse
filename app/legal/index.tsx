import React from 'react';
import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Pressable
          style={styles.back}
          onPress={() => router.back()}
          accessibilityLabel="戻る"
          accessibilityRole="button"
          accessibilityHint="前の画面に戻ります"
        >
          <Text style={styles.backText}>{'<'} 戻る</Text>
        </Pressable>

        <Text style={styles.title} accessibilityRole="header">特定商取引法に基づく表記</Text>
        <View style={styles.table}>
          {[
            ['販売事業者', '個人運営'],
            ['所在地', '請求があれば開示します'],
            ['メール', 'support@ongeki-pulse.app'],
            ['価格', '無料（基本機能）/ 有料コンテンツあり'],
            ['返品・解約', 'デジタルコンテンツのため返品不可'],
          ].map(([k, v]) => (
            <View key={k} style={styles.row}>
              <Text style={styles.key}>{k}</Text>
              <Text style={styles.val}>{v}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>関連ページ</Text>

        <Pressable
          style={styles.linkButton}
          onPress={() => router.push('/legal/privacy')}
          accessibilityRole="link"
          accessibilityLabel="プライバシーポリシーを見る"
          accessibilityHint="プライバシーポリシーページに移動します"
        >
          <Text style={styles.linkText}>プライバシーポリシー</Text>
          <Text style={styles.linkArrow}>{'>'}</Text>
        </Pressable>

        <Pressable
          style={styles.linkButton}
          onPress={() => router.push('/legal/terms')}
          accessibilityRole="link"
          accessibilityLabel="利用規約を見る"
          accessibilityHint="利用規約ページに移動します"
        >
          <Text style={styles.linkText}>利用規約</Text>
          <Text style={styles.linkArrow}>{'>'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  scroll: { padding: 20 },
  back: { marginBottom: 16, minHeight: 44, justifyContent: 'center' },
  backText: { color: '#60A5FA', fontSize: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 20 },
  table: { gap: 12 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 12 },
  key: { color: '#9CA3AF', width: 120, fontSize: 14 },
  val: { color: '#fff', flex: 1, fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#9CA3AF', marginTop: 32, marginBottom: 12 },
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  linkText: { color: '#60A5FA', fontSize: 15, fontWeight: '600' },
  linkArrow: { color: '#9CA3AF', fontSize: 16 },
});
