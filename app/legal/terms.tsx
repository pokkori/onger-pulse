import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsPage() {
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
          <Text style={styles.title} accessibilityRole="header">利用規約</Text>

          <Text style={styles.section}>第1条（サービスの利用）</Text>
          <Text style={styles.body}>
            音撃パルスは個人利用を目的とした音楽ゲームアプリです。
            本規約に同意の上でご利用ください。
          </Text>

          <Text style={styles.section}>第2条（コンテンツ）</Text>
          <Text style={styles.body}>
            アプリ内の楽曲・サウンド・画像・デザインは著作権により保護されています。
            無断転載・配信・商業利用を禁止します。
          </Text>

          <Text style={styles.section}>第3条（禁止事項）</Text>
          <Text style={styles.body}>
            {'- 本アプリの不正改ざん・リバースエンジニアリング\n'}
            {'- チートツールの使用\n'}
            {'- 本アプリを利用した第三者への迷惑行為'}
          </Text>

          <Text style={styles.section}>第4条（免責事項）</Text>
          <Text style={styles.body}>
            本アプリの利用によって生じた損害について、開発者は一切の責任を負いません。
            アプリは現状有姿で提供され、動作を保証するものではありません。
          </Text>

          <Text style={styles.section}>第5条（サブスクリプション）</Text>
          <Text style={styles.body}>
            有料プランはApp Store経由で決済されます。
            解約はApp Storeのサブスクリプション設定から行えます。
            デジタルコンテンツの性質上、購入後の返金には応じられません。
          </Text>

          <Text style={styles.section}>第6条（規約の変更）</Text>
          <Text style={styles.body}>
            本規約はアプリのアップデートに伴い変更される場合があります。
            継続してご利用いただいた場合、変更後の規約に同意したものとみなします。
          </Text>

          <Text style={styles.section}>第7条（準拠法）</Text>
          <Text style={styles.body}>
            本規約は日本法に基づき解釈されます。
          </Text>

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
