import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../src/constants/colors";
import { IAPProduct } from "../src/types/shop";
import { Card } from "../src/components/ui/Card";

const PRODUCTS: IAPProduct[] = [
  {
    id: "bp_song_edm_pack",
    name: "EDM Pack",
    description: "3 EDM songs",
    type: "non_consumable",
    displayPrice: "\u00A5490",
    unlocks: ["edm-1", "edm-2", "edm-3"],
  },
  {
    id: "bp_song_jpop_pack",
    name: "J-Pop Pack",
    description: "3 J-Pop songs",
    type: "non_consumable",
    displayPrice: "\u00A5490",
    unlocks: ["jpop-1", "jpop-2", "jpop-3"],
  },
  {
    id: "bp_skin_fire",
    name: "Fire",
    description: "Inferno effect skin",
    type: "non_consumable",
    displayPrice: "\u00A5250",
    unlocks: ["fire"],
  },
  {
    id: "bp_skin_ice",
    name: "Ice",
    description: "Frost Wave effect skin",
    type: "non_consumable",
    displayPrice: "\u00A5250",
    unlocks: ["ice"],
  },
  {
    id: "bp_skin_galaxy",
    name: "Galaxy",
    description: "Cosmic Pulse effect skin",
    type: "non_consumable",
    displayPrice: "\u00A5250",
    unlocks: ["galaxy"],
  },
  {
    id: "bp_remove_ads",
    name: "Remove Ads",
    description: "Remove all ads permanently",
    type: "non_consumable",
    displayPrice: "\u00A5980",
  },
  {
    id: "bp_season_pass",
    name: "Season Pass",
    description: "All songs + all skins + no ads",
    type: "subscription",
    displayPrice: "\u00A51,480/mo",
  },
];

export default function ShopScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="戻る"
          accessibilityHint="前の画面に戻ります"
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text style={styles.backButton}>{"\u2190"} BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SHOP</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {/* Song packs */}
        <Text style={styles.sectionTitle}>Song Packs</Text>
        <View style={styles.grid}>
          {PRODUCTS.filter((p) => p.id.includes("song")).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.gridItem}
              accessibilityRole="button"
              accessibilityLabel={`${product.name}を購入する、${product.displayPrice}`}
              accessibilityHint="タップして購入画面に進みます"
            >
              <Card>
                <Text style={styles.productIcon}>
                  {"\u{1F3B5}"}
                </Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDesc}>{product.description}</Text>
                <Text style={styles.productPrice}>
                  {product.displayPrice}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skins */}
        <Text style={styles.sectionTitle}>Effect Skins</Text>
        <View style={styles.grid}>
          {PRODUCTS.filter((p) => p.id.includes("skin")).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.gridItem}
              accessibilityRole="button"
              accessibilityLabel={`${product.name}スキンを購入する、${product.displayPrice}`}
              accessibilityHint="タップして購入画面に進みます"
            >
              <Card>
                <Text style={styles.productIcon}>
                  {product.name === "Fire"
                    ? "\u{1F525}"
                    : product.name === "Ice"
                      ? "\u{2744}"
                      : "\u{1F30C}"}
                </Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  {product.displayPrice}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium */}
        <Text style={styles.sectionTitle}>Premium</Text>
        {PRODUCTS.filter(
          (p) =>
            p.id === "bp_remove_ads" || p.id === "bp_season_pass"
        ).map((product) => (
          <TouchableOpacity
            key={product.id}
            style={{ minHeight: 44 }}
            accessibilityRole="button"
            accessibilityLabel={`${product.name}を購入する、${product.displayPrice}`}
            accessibilityHint="タップして購入画面に進みます"
          >
            <Card style={styles.premiumCard}>
              <View style={styles.premiumRow}>
                <View>
                  <Text style={styles.productName}>
                    {product.id === "bp_remove_ads"
                      ? "\u{1F6AB}"
                      : "\u{1F451}"}{" "}
                    {product.name}
                  </Text>
                  <Text style={styles.productDesc}>
                    {product.description}
                  </Text>
                </View>
                <Text style={styles.premiumPrice}>
                  {product.displayPrice}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreButton}
          accessibilityRole="button"
          accessibilityLabel="購入を復元する"
          accessibilityHint="過去の購入履歴を復元します"
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "47%",
  },
  productIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  productName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  productDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  productPrice: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "900",
  },
  premiumCard: {
    marginBottom: 8,
  },
  premiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  premiumPrice: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "900",
  },
  restoreButton: {
    marginTop: 24,
    alignItems: "center",
  },
  restoreText: {
    color: COLORS.textMuted,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
