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
        >
          <Text style={styles.backText}>← 戻る</Text>
        </Pressable>
        <Text style={styles.title}>特定商取引法に基づく表記</Text>
        <View style={styles.table}>
          {[
            ['販売事業者', '個人運営'],
            ['所在地', '請求があれば開示します'],
            ['メール', 'support@example.com'],
            ['価格', '無料（基本機能）/ 有料コンテンツあり'],
            ['返品・解約', 'デジタルコンテンツのため返品不可'],
          ].map(([k, v]) => (
            <View key={k} style={styles.row}>
              <Text style={styles.key}>{k}</Text>
              <Text style={styles.val}>{v}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.title, { marginTop: 32 }]}>プライバシーポリシー</Text>
        <Text style={styles.body}>
          本アプリ「音撃パルス」はユーザーのプライバシーを尊重します。{'\n\n'}
          ゲームの進行データは端末内のみに保存されます。広告配信のためAdMob（Google社）のSDKを使用しています。
          収集した情報を第三者に販売することはありません。
        </Text>
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
  body: { color: '#D1D5DB', fontSize: 14, lineHeight: 22 },
});
