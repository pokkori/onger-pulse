# 音撃パルス / Beat Pulse — 詳細設計書 v1.0

> **最終更新**: 2026-03-20
> **ステータス**: 実装待ち
> **対象プラットフォーム**: iOS 15+ / Android 10+
> **技術スタック**: React Native (Expo SDK 52) + TypeScript

---

## 目次

1. [プロジェクト構成](#1-プロジェクト構成)
2. [TypeScript型定義](#2-typescript型定義)
3. [画面設計](#3-画面設計)
4. [ゲームロジック](#4-ゲームロジック)
5. [サウンド設計](#5-サウンド設計)
6. [収益化設計](#6-収益化設計)
7. [アプリ特有機能](#7-アプリ特有機能)
8. [データ永続化](#8-データ永続化)
9. [シェア機能](#9-シェア機能)
10. [初期コンテンツ](#10-初期コンテンツ)

---

## 1. プロジェクト構成

### 1.1 ディレクトリ構造

```
beat-pulse/
├── app.json
├── app.config.ts
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── eas.json
├── .env
├── .env.example
├── app/
│   ├── _layout.tsx                    # Root layout (expo-router)
│   ├── index.tsx                      # タイトル画面
│   ├── game.tsx                       # ゲーム画面
│   ├── result.tsx                     # リザルト画面
│   ├── select.tsx                     # 楽曲選択画面
│   └── shop.tsx                       # ショップ画面
├── src/
│   ├── types/
│   │   ├── enemy.ts                   # Enemy, EnemyType, Direction
│   │   ├── beatmap.ts                 # BeatMap, BeatLayer, BeatNote
│   │   ├── judgment.ts                # Judgment, JudgmentResult
│   │   ├── game-state.ts             # GameState, GamePhase
│   │   ├── skill.ts                   # Skill, SkillEffect
│   │   ├── skin.ts                    # SkinDef, SkinCategory
│   │   ├── shop.ts                    # IAPProduct, PurchaseState
│   │   ├── achievement.ts            # Achievement, AchievementProgress
│   │   └── index.ts                   # 全型の再エクスポート
│   ├── engine/
│   │   ├── GameEngine.ts             # メインゲームループ
│   │   ├── EnemySpawner.ts           # 敵出現管理
│   │   ├── JudgmentSystem.ts         # タップ判定
│   │   ├── ScoreCalculator.ts        # スコア計算
│   │   ├── ComboManager.ts           # コンボ管理
│   │   ├── DifficultyManager.ts      # 難易度曲線
│   │   └── CollisionDetector.ts      # タップ位置と敵の衝突判定
│   ├── audio/
│   │   ├── AudioEngine.ts            # expo-av を用いたサウンド管理
│   │   ├── BeatClock.ts              # BPM同期クロック
│   │   ├── LayerMixer.ts             # BGMレイヤーのミックス管理
│   │   └── SoundEffects.ts           # SE再生
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameCanvas.tsx         # react-native-skia メインキャンバス
│   │   │   ├── EnemyRenderer.tsx      # 敵描画
│   │   │   ├── JudgmentEffect.tsx     # 判定エフェクト (Perfect/Great/Good/Miss)
│   │   │   ├── ComboDisplay.tsx       # コンボ数表示
│   │   │   ├── ScoreDisplay.tsx       # スコア表示
│   │   │   ├── LayerIndicator.tsx     # BGMレイヤーインジケーター
│   │   │   ├── ProgressBar.tsx        # 楽曲進捗バー
│   │   │   ├── PulseRing.tsx          # 中心のパルスリング
│   │   │   └── HitArea.tsx            # タップ判定エリア可視化
│   │   ├── ui/
│   │   │   ├── Button.tsx             # 汎用ボタン
│   │   │   ├── Modal.tsx              # 汎用モーダル
│   │   │   ├── Card.tsx               # カードコンポーネント
│   │   │   ├── Badge.tsx              # バッジ (NEW, LOCKED等)
│   │   │   ├── StarRating.tsx         # 難易度星表示
│   │   │   └── AnimatedText.tsx       # アニメ付きテキスト
│   │   └── share/
│   │       ├── ScoreCard.tsx          # シェア用スコアカード
│   │       └── ReplayCapture.tsx      # リプレイキャプチャ
│   ├── hooks/
│   │   ├── useGameLoop.ts            # requestAnimationFrame ループ
│   │   ├── useAudio.ts               # オーディオ制御
│   │   ├── useBeatClock.ts           # BPM同期
│   │   ├── useHaptics.ts             # 振動制御
│   │   ├── useStorage.ts             # AsyncStorage ラッパー
│   │   ├── usePurchase.ts            # RevenueCat フック
│   │   └── useAchievements.ts        # 実績管理
│   ├── stores/
│   │   ├── gameStore.ts              # Zustand: ゲーム状態
│   │   ├── playerStore.ts            # Zustand: プレイヤーデータ
│   │   └── settingsStore.ts          # Zustand: 設定
│   ├── data/
│   │   ├── beatmaps/
│   │   │   ├── neon-rush.json         # 楽曲1: Neon Rush
│   │   │   ├── midnight-pulse.json    # 楽曲2: Midnight Pulse
│   │   │   └── cyber-storm.json       # 楽曲3: Cyber Storm
│   │   ├── skins.ts                   # スキン定義
│   │   ├── achievements.ts           # 実績定義
│   │   └── skills.ts                  # スキル定義
│   ├── utils/
│   │   ├── math.ts                    # ベクトル演算, 角度計算
│   │   ├── timing.ts                  # 高精度タイマー
│   │   ├── format.ts                  # 数値/テキストフォーマット
│   │   └── share.ts                   # シェアユーティリティ
│   └── constants/
│       ├── layout.ts                  # 画面サイズ, マージン
│       ├── colors.ts                  # カラーパレット
│       ├── animation.ts              # アニメーション定数
│       └── config.ts                  # ゲーム設定定数
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   │   ├── neon-rush/
│   │   │   │   ├── drums.mp3          # レイヤー1: ドラム
│   │   │   │   ├── bass.mp3           # レイヤー2: ベース
│   │   │   │   ├── melody.mp3         # レイヤー3: メロディ
│   │   │   │   ├── chorus.mp3         # レイヤー4: コーラス
│   │   │   │   └── fx.mp3             # レイヤー5: エフェクト
│   │   │   ├── midnight-pulse/
│   │   │   │   ├── drums.mp3
│   │   │   │   ├── bass.mp3
│   │   │   │   ├── melody.mp3
│   │   │   │   ├── chorus.mp3
│   │   │   │   └── fx.mp3
│   │   │   └── cyber-storm/
│   │   │       ├── drums.mp3
│   │   │       ├── bass.mp3
│   │   │       ├── melody.mp3
│   │   │       ├── chorus.mp3
│   │   │       └── fx.mp3
│   │   └── se/
│   │       ├── tap-perfect.wav        # Perfect SE
│   │       ├── tap-great.wav          # Great SE
│   │       ├── tap-good.wav           # Good SE
│   │       ├── tap-miss.wav           # Miss SE
│   │       ├── combo-5.wav            # コンボ5到達SE
│   │       ├── combo-10.wav           # コンボ10到達SE
│   │       ├── combo-25.wav           # コンボ25到達SE
│   │       ├── combo-50.wav           # コンボ50到達SE
│   │       ├── layer-up.wav           # レイヤー追加SE
│   │       ├── layer-down.wav         # レイヤー減少SE
│   │       ├── enemy-explode.wav      # 敵爆破SE
│   │       ├── stage-clear.wav        # ステージクリアSE
│   │       └── game-over.wav          # ゲームオーバーSE
│   ├── images/
│   │   ├── logo.png                   # ロゴ (512x512)
│   │   ├── icon.png                   # アプリアイコン (1024x1024)
│   │   ├── splash.png                 # スプラッシュ (1284x2778)
│   │   ├── adaptive-icon.png          # Android adaptive (1024x1024)
│   │   ├── share-template.png         # シェアカードテンプレート (1200x630)
│   │   ├── enemies/
│   │   │   ├── normal.png             # 通常敵 (128x128)
│   │   │   ├── fast.png               # 高速敵 (128x128)
│   │   │   ├── heavy.png              # 重装敵 (192x192)
│   │   │   ├── split.png              # 分裂敵 (128x128)
│   │   │   └── boss.png               # ボス (256x256)
│   │   ├── skins/
│   │   │   ├── default/               # デフォルトスキン
│   │   │   │   ├── pulse.png
│   │   │   │   ├── hit-effect.png
│   │   │   │   └── trail.png
│   │   │   ├── neon/
│   │   │   ├── fire/
│   │   │   ├── ice/
│   │   │   └── galaxy/
│   │   └── ui/
│   │       ├── btn-play.png
│   │       ├── btn-shop.png
│   │       ├── icon-lock.png
│   │       ├── icon-star.png
│   │       └── icon-coin.png
│   └── fonts/
│       ├── Orbitron-Bold.ttf          # タイトル/スコア用
│       └── NotoSansJP-Medium.ttf      # 日本語UI用
└── __tests__/
    ├── engine/
    │   ├── JudgmentSystem.test.ts
    │   ├── ScoreCalculator.test.ts
    │   └── ComboManager.test.ts
    └── utils/
        ├── math.test.ts
        └── timing.test.ts
```

### 1.2 package.json

```json
{
  "name": "beat-pulse",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "build:ios": "eas build --platform ios --profile production",
    "build:android": "eas build --platform android --profile production",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-av": "~14.0.0",
    "expo-haptics": "~13.0.0",
    "expo-router": "~4.0.0",
    "expo-sharing": "~12.0.0",
    "expo-file-system": "~17.0.0",
    "expo-image": "~2.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-splash-screen": "~0.27.0",
    "expo-notifications": "~0.28.0",
    "expo-store-review": "~7.0.0",
    "expo-font": "~12.0.0",
    "expo-asset": "~10.0.0",
    "expo-linking": "~7.0.0",
    "expo-constants": "~16.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-reanimated": "~3.16.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-safe-area-context": "~4.12.0",
    "react-native-screens": "~4.0.0",
    "@shopify/react-native-skia": "~1.5.0",
    "@react-native-async-storage/async-storage": "~2.1.0",
    "zustand": "~5.0.0",
    "react-native-purchases": "~8.2.0",
    "react-native-google-mobile-ads": "~14.0.0",
    "react-native-view-shot": "~4.0.0",
    "react-native-share": "~11.0.0",
    "date-fns": "~3.6.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.5.0",
    "jest": "~29.7.0",
    "jest-expo": "~52.0.0",
    "@testing-library/react-native": "~12.7.0",
    "eslint": "~8.57.0",
    "@typescript-eslint/parser": "~7.0.0",
    "@typescript-eslint/eslint-plugin": "~7.0.0",
    "eslint-plugin-react": "~7.35.0",
    "eslint-plugin-react-hooks": "~4.6.0"
  }
}
```

### 1.3 app.config.ts

```typescript
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "音撃パルス",
  slug: "beat-pulse",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "beatpulse",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "cover",
    backgroundColor: "#0A0A1A",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.pokkori.beatpulse",
    buildNumber: "1",
    infoPlist: {
      UIBackgroundModes: ["audio"],
      NSUserTrackingUsageDescription:
        "広告の最適化のためにトラッキングを許可してください",
    },
    config: {
      googleMobileAdsAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#0A0A1A",
    },
    package: "com.pokkori.beatpulse",
    versionCode: 1,
    permissions: ["VIBRATE", "INTERNET", "ACCESS_NETWORK_STATE"],
    config: {
      googleMobileAdsAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ",
    },
  },
  plugins: [
    "expo-router",
    "expo-font",
    [
      "expo-notifications",
      {
        icon: "./assets/images/icon.png",
        color: "#FF00FF",
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~ZZZZZZZZZZ",
        iosAppId: "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    },
    revenueCatApiKeyIos: "appl_XXXXXXXXXXXXXXXXXXX",
    revenueCatApiKeyAndroid: "goog_XXXXXXXXXXXXXXXXXXX",
  },
});
```

### 1.4 eas.json

```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "pokkori@example.com", "ascAppId": "XXXXXXXXXX" },
      "android": { "serviceAccountKeyPath": "./google-services.json" }
    }
  }
}
```

---

## 2. TypeScript型定義

### 2.1 src/types/enemy.ts

```typescript
/** 敵の出現方向（画面端の8方向） */
export type Direction =
  | "N"   // 上
  | "NE"  // 右上
  | "E"   // 右
  | "SE"  // 右下
  | "S"   // 下
  | "SW"  // 左下
  | "W"   // 左
  | "NW"; // 左上

/** 敵の種類 */
export type EnemyType =
  | "normal"  // 通常: HP1, 速度1.0, 1タップ撃破
  | "fast"    // 高速: HP1, 速度2.0, 小さい判定
  | "heavy"   // 重装: HP3, 速度0.6, 3タップ撃破
  | "split"   // 分裂: HP1, 速度0.8, 撃破時に2体のmini生成
  | "boss";   // ボス: HP10, 速度0.3, 楽曲終盤に出現

/** 敵インスタンス */
export interface Enemy {
  /** 一意ID (uuid v4) */
  id: string;
  /** 敵の種類 */
  type: EnemyType;
  /** 残HP */
  hp: number;
  /** 最大HP */
  maxHp: number;
  /** 移動速度倍率 (1.0 = 基準速度 200px/sec) */
  speed: number;
  /** 出現方向 */
  direction: Direction;
  /**
   * 出現タイミング（楽曲開始からのミリ秒）
   * BeatMapの定義に基づく
   */
  spawnTimeMs: number;
  /**
   * 現在の画面座標（中心点）
   * 画面中心が (0,0)、画面端から中心に向かって移動
   */
  position: { x: number; y: number };
  /**
   * 当たり判定の半径 (px)
   * normal: 40, fast: 30, heavy: 60, split: 35, boss: 80
   */
  hitRadius: number;
  /** 生存中か */
  alive: boolean;
  /** 画面中心到達までの残り時間 (ms) */
  timeToCenter: number;
  /** 撃破時に付与されるベーススコア */
  baseScore: number;
}

/** 敵の種類ごとの固定パラメータ */
export const ENEMY_PARAMS: Record<
  EnemyType,
  {
    hp: number;
    speed: number;
    hitRadius: number;
    baseScore: number;
  }
> = {
  normal: { hp: 1, speed: 1.0, hitRadius: 40, baseScore: 100 },
  fast: { hp: 1, speed: 2.0, hitRadius: 30, baseScore: 150 },
  heavy: { hp: 3, speed: 0.6, hitRadius: 60, baseScore: 300 },
  split: { hp: 1, speed: 0.8, hitRadius: 35, baseScore: 200 },
  boss: { hp: 10, speed: 0.3, hitRadius: 80, baseScore: 2000 },
};
```

### 2.2 src/types/beatmap.ts

```typescript
import { Direction, EnemyType } from "./enemy";

/** BGMの1レイヤー */
export interface BeatLayer {
  /** レイヤーID (0-4) */
  id: number;
  /** レイヤー名 */
  name: "drums" | "bass" | "melody" | "chorus" | "fx";
  /** 音声ファイルパス (assetsからの相対) */
  audioFile: string;
  /** このレイヤーが有効になるために必要な最低コンボ数 */
  comboThreshold: number;
  /** 現在の音量 (0.0 - 1.0) */
  volume: number;
}

/** ビートマップ上の1ノート（= 敵1体の出現定義） */
export interface BeatNote {
  /** 楽曲開始からのミリ秒 */
  timeMs: number;
  /** 出現方向 */
  direction: Direction;
  /** 敵の種類 */
  enemyType: EnemyType;
  /**
   * 画面中心到達までの移動時間 (ms)
   * この値が短いほど素早い反応が必要
   * 基準: 1500ms (BPM120の場合、3拍分)
   */
  travelTimeMs: number;
}

/** 楽曲全体の定義 */
export interface BeatMap {
  /** 楽曲ID */
  id: string;
  /** 楽曲タイトル */
  title: string;
  /** アーティスト名 */
  artist: string;
  /** BPM */
  bpm: number;
  /** 楽曲の長さ (ms) */
  durationMs: number;
  /** 難易度 (1-10) */
  difficulty: number;
  /** 難易度ラベル */
  difficultyLabel: "Easy" | "Normal" | "Hard" | "Expert";
  /** BGMレイヤー構成 (5層固定) */
  layers: BeatLayer[];
  /** 全ノート (出現順にソート済み) */
  notes: BeatNote[];
  /** アンロック条件 */
  unlockCondition: {
    type: "default" | "clear" | "purchase";
    /** type="clear"の場合: クリアすべき楽曲ID */
    requiredSongId?: string;
    /** type="purchase"の場合: IAP商品ID */
    iapProductId?: string;
  };
  /** サムネイル画像パス */
  thumbnailImage: string;
  /** プレビュー音声パス (15秒) */
  previewAudioFile: string;
}
```

### 2.3 src/types/judgment.ts

```typescript
/** 判定種類 */
export type Judgment = "perfect" | "great" | "good" | "miss";

/** 判定結果 */
export interface JudgmentResult {
  /** 判定種類 */
  judgment: Judgment;
  /** タップと正確なタイミングとの差 (ms, 正=遅い, 負=早い) */
  offsetMs: number;
  /** 対象の敵ID */
  enemyId: string;
  /** スコア加算値 (baseScore * judgmentMultiplier * comboMultiplier) */
  score: number;
  /** タップ位置 */
  tapPosition: { x: number; y: number };
  /** 判定時刻 (performance.now()) */
  timestamp: number;
}

/**
 * 判定ウィンドウ (ms)
 * タップ時刻と敵が中心に到達する時刻の差の絶対値で判定
 */
export const JUDGMENT_WINDOWS = {
  perfect: 30,  // ±30ms以内
  great: 60,    // ±60ms以内 (perfectの範囲は除く)
  good: 100,    // ±100ms以内 (great以内の範囲は除く)
  // 上記全てに該当しない = miss
} as const;

/** 判定ごとのスコア倍率 */
export const JUDGMENT_SCORE_MULTIPLIER: Record<Judgment, number> = {
  perfect: 1.0,
  great: 0.7,
  good: 0.4,
  miss: 0.0,
};

/** 判定ごとのコンボ継続可否 */
export const JUDGMENT_COMBO_CONTINUES: Record<Judgment, boolean> = {
  perfect: true,
  great: true,
  good: true,
  miss: false, // missでコンボリセット
};
```

### 2.4 src/types/game-state.ts

```typescript
import { Judgment, JudgmentResult } from "./judgment";
import { Enemy } from "./enemy";
import { BeatLayer } from "./beatmap";

/** ゲームフェーズ */
export type GamePhase =
  | "loading"     // アセットロード中
  | "countdown"   // 3,2,1カウントダウン
  | "playing"     // プレイ中
  | "paused"      // 一時停止
  | "cleared"     // ステージクリア
  | "failed";     // ゲームオーバー (ライフ0)

/** BGMレイヤーの現在状態 */
export interface LayerState {
  /** レイヤーID (0-4) */
  layerId: number;
  /** レイヤー名 */
  name: string;
  /** アクティブか (コンボ条件を満たしているか) */
  active: boolean;
  /** 現在の音量 (フェードイン/アウト中は0-1の中間値) */
  currentVolume: number;
  /** 目標音量 */
  targetVolume: number;
}

/** ゲーム状態（Zustand store） */
export interface GameState {
  // === フェーズ ===
  phase: GamePhase;

  // === 時間 ===
  /** 楽曲開始からの経過時間 (ms) */
  elapsedMs: number;
  /** 前フレームからの経過時間 (ms) */
  deltaMs: number;

  // === スコア ===
  /** 現在のスコア */
  score: number;
  /** コンボ数 */
  combo: number;
  /** 最大コンボ数 */
  maxCombo: number;
  /** コンボ倍率 (1.0 + floor(combo / 10) * 0.1, 最大3.0) */
  comboMultiplier: number;

  // === 判定カウント ===
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  missCount: number;
  /** 総ノート数 (楽曲定義から) */
  totalNotes: number;

  // === ライフ ===
  /** 残りライフ (初期5, miss時-1, 0でfailed) */
  life: number;
  /** 最大ライフ */
  maxLife: number;

  // === BGMレイヤー ===
  layers: LayerState[];
  /** 現在アクティブなレイヤー数 (0-5) */
  activeLayerCount: number;

  // === 敵 ===
  /** 画面上の生存敵リスト */
  enemies: Enemy[];
  /** 撃破した敵の総数 */
  killCount: number;

  // === 判定履歴 (直近20件、リプレイ用) ===
  recentJudgments: JudgmentResult[];

  // === 選択中の楽曲ID ===
  currentSongId: string;

  // === 選択中のスキンID ===
  currentSkinId: string;

  // === アクション ===
  setPhase: (phase: GamePhase) => void;
  tick: (deltaMs: number) => void;
  addScore: (amount: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  addJudgment: (result: JudgmentResult) => void;
  spawnEnemy: (enemy: Enemy) => void;
  removeEnemy: (enemyId: string) => void;
  damageEnemy: (enemyId: string, damage: number) => void;
  takeDamage: () => void;
  updateLayers: () => void;
  reset: () => void;
}
```

### 2.5 src/types/skill.ts

```typescript
/** スキルカテゴリ */
export type SkillCategory = "offense" | "defense" | "utility";

/** スキル効果 */
export interface SkillEffect {
  /** 効果の種類 */
  type:
    | "score_bonus"        // スコア加算%アップ
    | "combo_shield"       // missしてもコンボが1回維持
    | "life_regen"         // 一定コンボごとにライフ回復
    | "slow_enemies"       // 敵の速度低下
    | "explosion_radius"   // タップの判定範囲拡大
    | "perfect_window"     // Perfect判定ウィンドウ拡大
    | "double_tap"         // タップ1回で近くの敵2体を攻撃
    | "critical_chance";   // 一定確率でスコア2倍
  /** 効果量 (効果の種類により意味が異なる) */
  value: number;
}

/** スキル定義 */
export interface Skill {
  /** スキルID */
  id: string;
  /** スキル名 */
  name: string;
  /** 説明文 */
  description: string;
  /** カテゴリ */
  category: SkillCategory;
  /** アイコン (emoji) */
  icon: string;
  /** 効果 */
  effect: SkillEffect;
  /** レアリティ (出現確率に影響) */
  rarity: "common" | "rare" | "epic";
}

/**
 * レベルアップ時のスキル選択画面で提示する選択肢
 * Vampire Survivors方式: 3択からランダムに提示
 */
export interface SkillChoice {
  /** 提示するスキル3つ */
  options: [Skill, Skill, Skill];
  /** 提示された楽曲内タイミング (ms) */
  offeredAtMs: number;
}
```

### 2.6 src/types/skin.ts

```typescript
/** スキンカテゴリ */
export type SkinCategory = "pulse" | "hitEffect" | "trail" | "background";

/** スキン定義 */
export interface SkinDef {
  /** スキンID */
  id: string;
  /** スキン名 */
  name: string;
  /** 説明文 */
  description: string;
  /** カテゴリ */
  category: SkinCategory;
  /** プレビュー画像パス */
  previewImage: string;
  /** アンロック条件 */
  unlockCondition: {
    type: "default" | "achievement" | "purchase" | "combo";
    /** type="achievement"の場合: 実績ID */
    achievementId?: string;
    /** type="purchase"の場合: IAP商品ID */
    iapProductId?: string;
    /** type="combo"の場合: 必要最大コンボ数 */
    requiredCombo?: number;
  };
  /** エフェクトパラメータ (Skiaで描画) */
  effectParams: {
    /** メインカラー (hex) */
    primaryColor: string;
    /** セカンダリカラー (hex) */
    secondaryColor: string;
    /** パーティクル数 */
    particleCount: number;
    /** パーティクルサイズ (px) */
    particleSize: number;
    /** グロー半径 (px) */
    glowRadius: number;
    /** アニメーション速度倍率 */
    animationSpeed: number;
  };
}
```

### 2.7 src/types/shop.ts

```typescript
/** IAP商品定義 */
export interface IAPProduct {
  /** RevenueCat商品ID */
  id: string;
  /** 商品名 */
  name: string;
  /** 説明 */
  description: string;
  /** 商品タイプ */
  type: "consumable" | "non_consumable" | "subscription";
  /** 価格 (表示用, 実際の価格はRevenueCatから取得) */
  displayPrice: string;
  /** 関連するアンロック (楽曲ID or スキンID) */
  unlocks?: string[];
}

/** 購入状態 */
export interface PurchaseState {
  /** 購入済みの商品IDリスト */
  purchasedProducts: string[];
  /** 広告除去を購入済みか */
  isAdFree: boolean;
  /** シーズンパスがアクティブか */
  isSeasonPassActive: boolean;
  /** ローディング中か */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
}
```

### 2.8 src/types/achievement.ts

```typescript
/** 実績定義 */
export interface Achievement {
  /** 実績ID */
  id: string;
  /** 実績名 */
  name: string;
  /** 説明文 */
  description: string;
  /** アイコン (emoji) */
  icon: string;
  /** アンロック条件の種類 */
  conditionType:
    | "total_score"       // 累計スコアがN以上
    | "max_combo"         // 最大コンボがN以上
    | "perfect_rate"      // Perfect率がN%以上
    | "songs_cleared"     // クリア楽曲数がN以上
    | "total_kills"       // 累計撃破数がN以上
    | "no_miss"           // ミスなしクリア
    | "full_layer"        // 全レイヤー同時アクティブ達成
    | "play_count"        // 累計プレイ回数がN以上
    | "boss_kill"         // ボス撃破
    | "specific_song";    // 特定楽曲クリア
  /** 条件値 */
  conditionValue: number;
  /** 条件値が楽曲IDの場合 */
  conditionSongId?: string;
  /** 報酬 */
  reward: {
    type: "skin" | "song" | "coins" | "title";
    id?: string;
    amount?: number;
  };
  /** Game Center / Google Play Games 実績ID */
  platformAchievementId: {
    ios: string;
    android: string;
  };
  /** 隠し実績か */
  hidden: boolean;
}

/** 実績の進捗状態 */
export interface AchievementProgress {
  /** 実績ID */
  achievementId: string;
  /** 現在の進捗値 */
  currentValue: number;
  /** アンロック済みか */
  unlocked: boolean;
  /** アンロック日時 (ISO8601) */
  unlockedAt?: string;
}
```

### 2.9 src/types/index.ts

```typescript
export * from "./enemy";
export * from "./beatmap";
export * from "./judgment";
export * from "./game-state";
export * from "./skill";
export * from "./skin";
export * from "./shop";
export * from "./achievement";
```

---

## 3. 画面設計

### 3.1 タイトル画面 (`app/index.tsx`)

```
┌──────────────────────────────────────┐
│           (ステータスバー非表示)         │
│                                      │
│                                      │
│          ░░ 音撃パルス ░░             │  ← ロゴ: 上部30%
│          BEAT PULSE                  │     Orbitron-Bold, 48px
│                                      │     グローアニメーション
│          ♪ ～ ♪ ～ ♪                │  ← パルスリングアニメ
│       (中央パルスリングが              │     BPM120で拡縮
│        BGMに合わせて脈動)             │
│                                      │
│     ┌─────────────────────┐          │
│     │      ▶  PLAY        │          │  ← メインCTA
│     └─────────────────────┘          │     W: 60%, H: 56px
│                                      │     グラデーション(#FF00FF → #00FFFF)
│     ┌─────────────────────┐          │     border-radius: 28px
│     │      🎵 SELECT      │          │
│     └─────────────────────┘          │  ← 楽曲選択ボタン
│                                      │     W: 60%, H: 48px
│     ┌─────────────────────┐          │     背景: transparent
│     │      🛒 SHOP        │          │     border: 1px solid #FF00FF
│     └─────────────────────┘          │
│                                      │
│  🔊  ⚙️                    v1.0.0    │  ← 下部バー
│                                      │     左: サウンドON/OFF, 設定
│                                      │     右: バージョン
└──────────────────────────────────────┘
```

**アニメーション**:
- ロゴ: `useSharedValue` + `withRepeat(withSequence(withTiming(1.05, 500ms), withTiming(1.0, 500ms)))` = BPM120で脈動
- パルスリング: Skia `Circle` + `BlurMask` がBPM同期で拡縮。半径 80→120px を500ms周期でループ
- BGM: タイトル画面ではレイヤー1（ドラム）のみ低音量(0.3)で再生。PLAYタップ時にフェードアウト(300ms)
- ボタン: タップ時 `scale: 0.95` → `1.0` (100ms) + ハプティクス (Light)

**遷移**:
- PLAY → 最後に選択した楽曲で `game.tsx` へ（初回はNeon Rush）
- SELECT → `select.tsx` へ
- SHOP → `shop.tsx` へ

---

### 3.2 ゲーム画面 (`app/game.tsx`)

```
┌──────────────────────────────────────┐
│ SCORE: 12,450    ♪♪♪♪♪  COMBO: 23  │ ← 上部HUD (高さ60px)
│ ████████████░░░░░░░░░░░░  02:15     │    スコア左寄せ / レイヤーインジケーター中央 / コンボ右寄せ
│                                      │    プログレスバー: 楽曲進捗
│                                      │    残り時間: mm:ss
│         ＼    🔴    ／               │
│          ＼  (敵)  ／                │ ← 敵: 8方向から中心へ移動
│           ＼      ／                 │    移動軌跡はDirection→中心の直線
│    🟢 ──── ◉ ──── 🔵               │
│           ／      ＼                 │ ← 中心: パルスリング (◉)
│          ／        ＼                │    半径60pxの円、BPM同期で脈動
│         ／    🟡    ＼               │    リング色 = 現在のスキンカラー
│                                      │
│                                      │
│  ❤️❤️❤️❤️❤️                          │ ← ライフ: 左下, 最大5
│                                      │
│ ┌──────┐                             │ ← 一時停止ボタン: 右下
│ │  ⏸   │                             │    32x32px, 透過度0.5
│ └──────┘                             │
│                                      │
│    ★ PERFECT ★                      │ ← 判定表示: 中央やや下
│                                      │    Perfect: #FFD700, scale 1.2→1.0
│    x2.3                              │    Great: #00FF00
│                                      │    Good: #00BFFF
│                                      │    Miss: #FF0000
└──────────────────────────────────────┘
```

**レイヤーインジケーター**: 上部中央の5つのアイコン
```
♪♪♪♪♪   ← 5つのノートアイコン
明 明 暗 暗 暗  ← アクティブ=明るい色(#FF00FF), 非アクティブ=暗い色(#333)
ド ベ メ コ エ  ← drums / bass / melody / chorus / fx
```
各アイコンは12x12pxの丸、アクティブ時にグロー付き

**敵の出現・移動**:
- 画面端（方向に対応する位置）からスポーンし、画面中心に向かって直線移動
- 敵の表示サイズ = `hitRadius * 2`
- 中心到達前にタップされないと通過 → Miss判定 + ライフ-1

**タップ操作**:
- `onTouchStart` で座標取得
- 最も近い生存敵との距離を計算
- 距離が `enemy.hitRadius + 60px (タップ余裕)` 以内なら判定処理
- 複数敵が範囲内の場合、最も中心に近い（最も緊急度が高い）敵を対象にする

**判定エフェクト** (JudgmentEffect.tsx):
- Perfect: 金色リング拡散 (60→120px, 200ms) + パーティクル16個 + テキスト "PERFECT" (scale 1.5→1.0, 300ms)
- Great: 緑リング拡散 (50→100px, 200ms) + パーティクル8個 + テキスト "GREAT"
- Good: 青リング拡散 (40→80px, 150ms) + パーティクル4個 + テキスト "GOOD"
- Miss: 赤フラッシュ (画面端が赤く光る, 100ms) + テキスト "MISS" (shake animation)

**カウントダウン** (playing開始前):
- 3 → 2 → 1 → GO! (各800ms)
- 数字: Orbitron-Bold 96px, scale 2.0→1.0→0.5 + opacity 1.0→0.0
- "GO!": #FF00FF, 同上 + ハプティクス (Medium)

**一時停止モーダル**:
```
┌────────────────────┐
│     PAUSED         │
│                    │
│   ▶ RESUME         │
│   🔄 RETRY         │
│   🏠 QUIT          │
└────────────────────┘
```
背景: 半透明黒 (rgba(0,0,0,0.7))

---

### 3.3 リザルト画面 (`app/result.tsx`)

```
┌──────────────────────────────────────┐
│                                      │
│         ✨ STAGE CLEAR ✨            │  ← or "GAME OVER" (#FF0000)
│                                      │
│  ┌────────────────────────────────┐  │
│  │  SCORE         128,450         │  │  ← 数値はカウントアップアニメ
│  │  MAX COMBO     47              │  │     0から最終値まで1500ms
│  │  PERFECT       82%             │  │
│  │  GREAT         12%             │  │
│  │  GOOD          4%              │  │
│  │  MISS          2%              │  │
│  │                                │  │
│  │  ♪♪♪♪♪  MAX LAYER: 5/5       │  │  ← 最大到達レイヤー数
│  │                                │  │
│  │  RANK:  S                      │  │  ← S/A/B/C/D判定
│  └────────────────────────────────┘  │     S: Perfect率90%+
│                                      │     A: Perfect率75%+
│  ┌──────┐ ┌──────┐ ┌──────┐         │     B: Perfect率60%+
│  │ 📷   │ │ 🎬   │ │ 🐦   │         │     C: Perfect率40%+
│  │Share │ │Replay│ │Tweet │         │     D: それ以下
│  └──────┘ └──────┘ └──────┘         │
│                                      │
│  ┌─────────────────────┐             │
│  │   🔄 RETRY          │             │  ← 同じ楽曲でリトライ
│  └─────────────────────┘             │
│  ┌─────────────────────┐             │
│  │   🏠 TITLE          │             │  ← タイトルに戻る
│  └─────────────────────┘             │
│                                      │
│  ┌─────────────────────┐             │
│  │  🎬 広告を見てx2    │             │  ← リワード動画でスコア2倍
│  └─────────────────────┘             │
└──────────────────────────────────────┘
```

**ランク判定ロジック**:
```typescript
function getRank(perfectRate: number): string {
  if (perfectRate >= 0.9) return "S";
  if (perfectRate >= 0.75) return "A";
  if (perfectRate >= 0.6) return "B";
  if (perfectRate >= 0.4) return "C";
  return "D";
}
```

**アンロック通知** (新楽曲/スキンがアンロックされた場合):
- リザルト表示後2秒で「NEW UNLOCK!」モーダルが出現
- アンロックされたアイテムのプレビュー表示
- 「OK」ボタンで閉じる

---

### 3.4 楽曲選択画面 (`app/select.tsx`)

```
┌──────────────────────────────────────┐
│  ← BACK          SELECT SONG        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🎵 Neon Rush                  │  │  ← 横スクロールカード
│  │  BPM: 128  ★★★☆☆  Normal     │  │     W: 85%, H: 160px
│  │                                │  │     背景: 楽曲サムネイル
│  │  BEST: 98,200  RANK: A         │  │     border-radius: 16px
│  │  ♪♪♪♪♪                        │  │     選択中: borderが光る
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🎵 Midnight Pulse             │  │
│  │  BPM: 140  ★★★★☆  Hard       │  │
│  │                                │  │
│  │  BEST: --  RANK: --            │  │
│  │  🔒 Clear "Neon Rush" first   │  │  ← ロック中の表示
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🎵 Cyber Storm                │  │
│  │  BPM: 160  ★★★★★  Expert     │  │
│  │                                │  │
│  │  BEST: --  RANK: --            │  │
│  │  🔒 Clear "Midnight Pulse"    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌─────────────────────┐             │
│  │   ▶  START          │             │  ← 選択中の楽曲で開始
│  └─────────────────────┘             │
│                                      │
│  スキン: [Default ▼]                 │  ← スキン選択ドロップダウン
└──────────────────────────────────────┘
```

**楽曲カードの動作**:
- タップで選択状態に（border: 2px solid #FF00FF, glow effect）
- ロック中の楽曲はタップ不可、グレーアウト（opacity: 0.4）
- 選択中の楽曲のプレビュー音声を自動再生（15秒ループ、volume: 0.5）
- カード内にベストスコアとランクを表示（未プレイは "--"）

---

### 3.5 ショップ画面 (`app/shop.tsx`)

```
┌──────────────────────────────────────┐
│  ← BACK            SHOP             │
│                                      │
│  ── 楽曲パック ──                     │
│  ┌──────────────┐ ┌──────────────┐   │
│  │ 🎵 EDM Pack  │ │ 🎵 J-Pop Pack│   │  ← 2列グリッド
│  │ 3曲入り      │ │ 3曲入り      │   │     各カード: W: 45%, H: 120px
│  │ ¥490         │ │ ¥490         │   │
│  └──────────────┘ └──────────────┘   │
│                                      │
│  ── エフェクトスキン ──               │
│  ┌──────────────┐ ┌──────────────┐   │
│  │ 🔥 Fire      │ │ ❄️ Ice       │   │
│  │ ¥250         │ │ ¥250         │   │
│  └──────────────┘ └──────────────┘   │
│  ┌──────────────┐ ┌──────────────┐   │
│  │ 🌌 Galaxy    │ │ ✅ Owned    │   │  ← 購入済みは緑チェック
│  │ ¥250         │ │              │   │
│  └──────────────┘ └──────────────┘   │
│                                      │
│  ── プレミアム ──                     │
│  ┌────────────────────────────────┐  │
│  │  🚫 広告除去        ¥980       │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  👑 シーズンパス   ¥1,480/月   │  │  ← 全楽曲+全スキン+広告除去
│  └────────────────────────────────┘  │
│                                      │
│  購入の復元                           │  ← テキストリンク
└──────────────────────────────────────┘
```

---

## 4. ゲームロジック

### 4.1 メインゲームループ (`src/engine/GameEngine.ts`)

```typescript
/**
 * メインゲームループ
 * requestAnimationFrame で毎フレーム実行
 * 目標: 60fps (16.67ms/frame)
 */
class GameEngine {
  private beatClock: BeatClock;
  private spawner: EnemySpawner;
  private judgmentSystem: JudgmentSystem;
  private scoreCalculator: ScoreCalculator;
  private comboManager: ComboManager;
  private layerMixer: LayerMixer;
  private lastTimestamp: number = 0;

  /**
   * 毎フレーム呼ばれるメインループ
   * @param timestamp - performance.now() の値
   */
  tick(timestamp: number): void {
    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // 1. BPMクロックを進める
    this.beatClock.advance(delta);

    // 2. 敵の出現判定
    //    現在時刻がspawnTimeMsを超えた未スポーン敵をスポーン
    const newEnemies = this.spawner.checkSpawns(this.beatClock.elapsedMs);
    for (const enemy of newEnemies) {
      gameStore.spawnEnemy(enemy);
    }

    // 3. 敵の移動
    //    各敵のpositionを中心方向に speed * delta 分移動
    for (const enemy of gameStore.enemies) {
      this.moveEnemy(enemy, delta);
    }

    // 4. 中心到達チェック
    //    中心に到達した敵 = ミス扱い
    for (const enemy of gameStore.enemies) {
      if (this.isAtCenter(enemy)) {
        this.handleMiss(enemy);
      }
    }

    // 5. BGMレイヤー更新
    this.layerMixer.updateVolumes(gameStore.combo);

    // 6. ゲーム終了判定
    if (gameStore.life <= 0) {
      gameStore.setPhase("failed");
    }
    if (this.beatClock.elapsedMs >= this.beatMap.durationMs && gameStore.enemies.length === 0) {
      gameStore.setPhase("cleared");
    }

    // 7. ステート更新
    gameStore.tick(delta);
  }

  /**
   * 敵を中心方向に移動させる
   */
  private moveEnemy(enemy: Enemy, deltaMs: number): void {
    // 基準速度: 200px/sec
    const BASE_SPEED = 200;
    const pxPerMs = (BASE_SPEED * enemy.speed) / 1000;
    const dx = 0 - enemy.position.x;
    const dy = 0 - enemy.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;
    const moveAmount = pxPerMs * deltaMs;
    const ratio = Math.min(moveAmount / dist, 1);
    enemy.position.x += dx * ratio;
    enemy.position.y += dy * ratio;
    enemy.timeToCenter = dist / pxPerMs;
  }

  /**
   * 中心到達判定
   * 中心からの距離が hitRadius 以下 = 到達
   */
  private isAtCenter(enemy: Enemy): boolean {
    const dist = Math.sqrt(
      enemy.position.x ** 2 + enemy.position.y ** 2
    );
    return dist <= enemy.hitRadius;
  }

  /**
   * ミス処理
   */
  private handleMiss(enemy: Enemy): void {
    gameStore.removeEnemy(enemy.id);
    gameStore.addJudgment({
      judgment: "miss",
      offsetMs: 0,
      enemyId: enemy.id,
      score: 0,
      tapPosition: { x: 0, y: 0 },
      timestamp: performance.now(),
    });
    gameStore.resetCombo();
    gameStore.takeDamage();
  }
}
```

### 4.2 敵出現アルゴリズム (`src/engine/EnemySpawner.ts`)

```typescript
/**
 * BeatMapのnotesに基づいて敵を出現させる
 * 出現タイミング = note.timeMs - note.travelTimeMs
 * (敵が画面端に現れるのは、判定タイミングよりtravelTimeMs前)
 */
class EnemySpawner {
  private beatMap: BeatMap;
  private nextNoteIndex: number = 0;
  private difficultyManager: DifficultyManager;

  /**
   * 現在の経過時刻で出現すべき敵をチェック
   * @param elapsedMs - 楽曲開始からの経過時刻
   * @returns 新規スポーンする敵のリスト
   */
  checkSpawns(elapsedMs: number): Enemy[] {
    const spawned: Enemy[] = [];

    while (this.nextNoteIndex < this.beatMap.notes.length) {
      const note = this.beatMap.notes[this.nextNoteIndex];
      // 出現時刻 = 判定時刻 - 移動時間
      const spawnTime = note.timeMs - note.travelTimeMs;

      if (elapsedMs >= spawnTime) {
        spawned.push(this.createEnemy(note));
        this.nextNoteIndex++;
      } else {
        break; // ソート済みなのでこれ以降は未来
      }
    }

    return spawned;
  }

  /**
   * BeatNoteからEnemyインスタンスを生成
   */
  private createEnemy(note: BeatNote): Enemy {
    const params = ENEMY_PARAMS[note.enemyType];
    const spawnPos = this.getSpawnPosition(note.direction);

    return {
      id: crypto.randomUUID(),
      type: note.enemyType,
      hp: params.hp,
      maxHp: params.hp,
      speed: params.speed,
      direction: note.direction,
      spawnTimeMs: note.timeMs,
      position: spawnPos,
      hitRadius: params.hitRadius,
      alive: true,
      timeToCenter: note.travelTimeMs,
      baseScore: params.baseScore,
    };
  }

  /**
   * 方向に応じた画面端の出現座標を返す
   * 座標系: 画面中心が(0,0)
   * 画面サイズ: SCREEN_WIDTH x SCREEN_HEIGHT (constants/layout.tsから)
   */
  private getSpawnPosition(direction: Direction): { x: number; y: number } {
    const hw = SCREEN_WIDTH / 2 + 50;  // 画面外に少しはみ出す
    const hh = SCREEN_HEIGHT / 2 + 50;
    const POSITIONS: Record<Direction, { x: number; y: number }> = {
      N:  { x: 0,    y: -hh },
      NE: { x: hw,   y: -hh },
      E:  { x: hw,   y: 0 },
      SE: { x: hw,   y: hh },
      S:  { x: 0,    y: hh },
      SW: { x: -hw,  y: hh },
      W:  { x: -hw,  y: 0 },
      NW: { x: -hw,  y: -hh },
    };
    return POSITIONS[direction];
  }
}
```

### 4.3 判定システム (`src/engine/JudgmentSystem.ts`)

```typescript
/**
 * タップ判定システム
 *
 * 判定フロー:
 * 1. タップ座標を受け取る
 * 2. タップ座標に最も近い生存敵を探す
 * 3. 敵との距離がhitRadius + TAP_MARGIN以内か判定
 * 4. 距離OK → タイミング判定 (Perfect/Great/Good)
 * 5. 距離NG → 最も近い敵にMiss判定は付与しない (空振り、スコアもペナルティもなし)
 */
class JudgmentSystem {
  /** タップ判定の追加マージン (px) — 指の太さ分の余裕 */
  private static readonly TAP_MARGIN = 60;

  /**
   * タップ時に呼ばれる
   * @param tapX - タップ座標X (画面中心基準)
   * @param tapY - タップ座標Y (画面中心基準)
   * @param tapTimestamp - タップ時刻 (performance.now())
   * @param enemies - 現在の生存敵リスト
   * @param beatClock - 現在のBPMクロック
   * @returns 判定結果 (対象敵がない場合はnull)
   */
  judge(
    tapX: number,
    tapY: number,
    tapTimestamp: number,
    enemies: Enemy[],
    beatClock: BeatClock
  ): JudgmentResult | null {
    // 1. 最も近い敵を探す
    let closestEnemy: Enemy | null = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const dx = tapX - enemy.position.x;
      const dy = tapY - enemy.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        closestEnemy = enemy;
      }
    }

    // 2. 距離チェック
    if (!closestEnemy || closestDist > closestEnemy.hitRadius + JudgmentSystem.TAP_MARGIN) {
      return null; // 空振り
    }

    // 3. タイミング判定
    //    敵が中心に到達する予定時刻と現在時刻の差
    const expectedArrivalMs = closestEnemy.spawnTimeMs; // ノートの判定タイミング
    const currentMs = beatClock.elapsedMs;
    const offsetMs = currentMs - expectedArrivalMs; // 正=遅い, 負=早い
    const absOffset = Math.abs(offsetMs);

    let judgment: Judgment;
    if (absOffset <= JUDGMENT_WINDOWS.perfect) {
      judgment = "perfect";
    } else if (absOffset <= JUDGMENT_WINDOWS.great) {
      judgment = "great";
    } else if (absOffset <= JUDGMENT_WINDOWS.good) {
      judgment = "good";
    } else {
      judgment = "miss";
    }

    // 4. スコア計算
    const score = ScoreCalculator.calculate(
      closestEnemy.baseScore,
      judgment,
      gameStore.combo
    );

    // 5. ダメージ適用
    if (judgment !== "miss") {
      gameStore.damageEnemy(closestEnemy.id, 1);
      if (closestEnemy.hp - 1 <= 0) {
        gameStore.removeEnemy(closestEnemy.id);
        // 分裂敵の場合はmini2体生成
        if (closestEnemy.type === "split") {
          this.spawnSplitChildren(closestEnemy);
        }
      }
    }

    return {
      judgment,
      offsetMs,
      enemyId: closestEnemy.id,
      score,
      tapPosition: { x: tapX, y: tapY },
      timestamp: tapTimestamp,
    };
  }

  /**
   * 分裂敵の子を生成
   * 親の位置から左右45度にずれた方向に2体のnormal敵をスポーン
   */
  private spawnSplitChildren(parent: Enemy): void {
    const angles = [Math.PI / 4, -Math.PI / 4];
    for (const angleOffset of angles) {
      const baseAngle = Math.atan2(parent.position.y, parent.position.x);
      const newAngle = baseAngle + angleOffset;
      const spawnDist = 100; // 親の位置から100px離れた位置にスポーン
      const child: Enemy = {
        id: crypto.randomUUID(),
        type: "normal",
        hp: 1,
        maxHp: 1,
        speed: 1.5,
        direction: parent.direction,
        spawnTimeMs: performance.now(),
        position: {
          x: parent.position.x + Math.cos(newAngle) * spawnDist,
          y: parent.position.y + Math.sin(newAngle) * spawnDist,
        },
        hitRadius: 30,
        alive: true,
        timeToCenter: 800, // 0.8秒で中心到達
        baseScore: 50,
      };
      gameStore.spawnEnemy(child);
    }
  }
}
```

### 4.4 スコア計算 (`src/engine/ScoreCalculator.ts`)

```typescript
/**
 * スコア計算式:
 *   score = baseScore * judgmentMultiplier * comboMultiplier
 *
 * comboMultiplier = 1.0 + floor(combo / 10) * 0.1
 *   combo 0-9   → 1.0x
 *   combo 10-19 → 1.1x
 *   combo 20-29 → 1.2x
 *   ...
 *   combo 200+  → 3.0x (上限)
 *
 * 最終スコア = floor(score) で小数切り捨て
 */
class ScoreCalculator {
  private static readonly MAX_COMBO_MULTIPLIER = 3.0;

  static calculate(
    baseScore: number,
    judgment: Judgment,
    combo: number
  ): number {
    const judgmentMult = JUDGMENT_SCORE_MULTIPLIER[judgment];
    const comboMult = Math.min(
      1.0 + Math.floor(combo / 10) * 0.1,
      ScoreCalculator.MAX_COMBO_MULTIPLIER
    );
    return Math.floor(baseScore * judgmentMult * comboMult);
  }

  /**
   * ランクを計算
   */
  static calculateRank(perfectRate: number): "S" | "A" | "B" | "C" | "D" {
    if (perfectRate >= 0.9) return "S";
    if (perfectRate >= 0.75) return "A";
    if (perfectRate >= 0.6) return "B";
    if (perfectRate >= 0.4) return "C";
    return "D";
  }
}
```

### 4.5 コンボ管理 (`src/engine/ComboManager.ts`)

```typescript
/**
 * コンボ管理
 *
 * コンボ→BGMレイヤー対応テーブル:
 *   コンボ  0     → レイヤー0 (drums) のみ
 *   コンボ  5+    → レイヤー1 (bass) 追加
 *   コンボ 15+    → レイヤー2 (melody) 追加
 *   コンボ 30+    → レイヤー3 (chorus) 追加
 *   コンボ 50+    → レイヤー4 (fx) 追加 = フルレイヤー
 *
 * missでコンボリセット → レイヤーが即座にではなく
 * 2秒かけてフェードアウト（「あの豪華な音を取り戻したい」欲求を演出）
 */
class ComboManager {
  /** コンボ→レイヤーのしきい値テーブル */
  static readonly LAYER_THRESHOLDS: number[] = [0, 5, 15, 30, 50];

  /**
   * 現在のコンボ数からアクティブにすべきレイヤー数を返す
   * @param combo 現在のコンボ
   * @returns アクティブレイヤー数 (1-5)
   */
  static getActiveLayerCount(combo: number): number {
    let count = 0;
    for (const threshold of ComboManager.LAYER_THRESHOLDS) {
      if (combo >= threshold) count++;
    }
    return count; // 最低1 (drumsは常に鳴る)
  }

  /**
   * コンボ倍率を返す
   */
  static getMultiplier(combo: number): number {
    return Math.min(1.0 + Math.floor(combo / 10) * 0.1, 3.0);
  }

  /**
   * コンボマイルストーン到達チェック (SE再生用)
   * @returns マイルストーン値 (5, 10, 25, 50) or null
   */
  static checkMilestone(prevCombo: number, newCombo: number): number | null {
    const milestones = [5, 10, 25, 50];
    for (const m of milestones) {
      if (prevCombo < m && newCombo >= m) return m;
    }
    return null;
  }
}
```

### 4.6 難易度曲線 (`src/engine/DifficultyManager.ts`)

```typescript
/**
 * 難易度曲線
 * ステージ進行（楽曲内の時間経過）に応じた難易度パラメータ
 *
 * 楽曲の進行を0.0〜1.0の「進捗率」で表現:
 *   0.0〜0.2 (イントロ)     : 低難易度、normalのみ、遅い出現間隔
 *   0.2〜0.4 (序盤)         : fast敵追加、出現間隔やや短縮
 *   0.4〜0.6 (中盤)         : heavy敵追加、複数同時出現開始
 *   0.6〜0.8 (後半)         : split敵追加、高速パターン
 *   0.8〜0.95 (クライマックス): 全敵種、最高密度
 *   0.95〜1.0 (ラスト)      : boss出現 + 通常敵サポート
 */

interface DifficultyParams {
  /** この進捗区間で出現可能な敵の種類 */
  allowedEnemyTypes: EnemyType[];
  /** 出現間隔の倍率 (1.0=基準, 0.5=2倍の密度) */
  spawnIntervalMultiplier: number;
  /** 敵の移動速度倍率 (全敵に適用) */
  speedMultiplier: number;
  /** 同時出現する最大敵数 */
  maxSimultaneous: number;
}

class DifficultyManager {
  /**
   * 進捗率から難易度パラメータを返す
   * (注意: 実際のノート配置はBeatMapで静的に定義されるため、
   *  この関数はBeatMapエディタ/生成ツールでの参照用)
   */
  static getParams(progress: number): DifficultyParams {
    if (progress < 0.2) {
      return {
        allowedEnemyTypes: ["normal"],
        spawnIntervalMultiplier: 1.5,
        speedMultiplier: 0.8,
        maxSimultaneous: 1,
      };
    }
    if (progress < 0.4) {
      return {
        allowedEnemyTypes: ["normal", "fast"],
        spawnIntervalMultiplier: 1.2,
        speedMultiplier: 1.0,
        maxSimultaneous: 2,
      };
    }
    if (progress < 0.6) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy"],
        spawnIntervalMultiplier: 1.0,
        speedMultiplier: 1.0,
        maxSimultaneous: 3,
      };
    }
    if (progress < 0.8) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy", "split"],
        spawnIntervalMultiplier: 0.8,
        speedMultiplier: 1.2,
        maxSimultaneous: 4,
      };
    }
    if (progress < 0.95) {
      return {
        allowedEnemyTypes: ["normal", "fast", "heavy", "split"],
        spawnIntervalMultiplier: 0.6,
        speedMultiplier: 1.3,
        maxSimultaneous: 5,
      };
    }
    // 0.95-1.0: ボス区間
    return {
      allowedEnemyTypes: ["normal", "fast", "boss"],
      spawnIntervalMultiplier: 0.7,
      speedMultiplier: 1.0,
      maxSimultaneous: 3,
    };
  }
}
```

---

## 5. サウンド設計

### 5.1 BGMレイヤー構成

各楽曲は5つの音声トラック（レイヤー）で構成される。全トラックは同一BPM・同一長さで、位相が完全に一致している。

| レイヤーID | 名前 | 内容 | コンボしきい値 | フェードイン時間 | フェードアウト時間 |
|---|---|---|---|---|---|
| 0 | drums | キック・スネア・ハイハット | 0 (常時) | - | - |
| 1 | bass | ベースライン | 5 | 500ms | 2000ms |
| 2 | melody | メインメロディ | 15 | 800ms | 2000ms |
| 3 | chorus | コーラス・パッド | 30 | 1000ms | 2000ms |
| 4 | fx | シンセエフェクト・ライザー | 50 | 1200ms | 2000ms |

**ミックス処理** (`src/audio/LayerMixer.ts`):

```typescript
class LayerMixer {
  private layers: Audio.Sound[] = []; // 5トラック分
  private targetVolumes: number[] = [0.8, 0, 0, 0, 0]; // 初期: drumsのみ
  private currentVolumes: number[] = [0.8, 0, 0, 0, 0];

  /**
   * コンボに基づいてレイヤーの目標音量を更新
   * 毎フレーム呼ばれる
   */
  updateVolumes(combo: number): void {
    const activeCount = ComboManager.getActiveLayerCount(combo);

    for (let i = 0; i < 5; i++) {
      // 目標音量の決定
      this.targetVolumes[i] = i < activeCount ? 0.8 : 0;

      // 現在音量を目標に近づける (線形補間)
      const fadeSpeed = this.targetVolumes[i] > this.currentVolumes[i]
        ? 0.002  // フェードイン: 500フレーム ≒ 500ms/0.8 ≒ 625ms
        : 0.0004; // フェードアウト: 2000フレーム ≒ 2000ms

      if (this.currentVolumes[i] < this.targetVolumes[i]) {
        this.currentVolumes[i] = Math.min(
          this.currentVolumes[i] + fadeSpeed,
          this.targetVolumes[i]
        );
      } else if (this.currentVolumes[i] > this.targetVolumes[i]) {
        this.currentVolumes[i] = Math.max(
          this.currentVolumes[i] - fadeSpeed,
          this.targetVolumes[i]
        );
      }

      // expo-av に音量を反映
      this.layers[i]?.setVolumeAsync(this.currentVolumes[i]);
    }
  }

  /**
   * 全レイヤーを同時再生開始
   * 位相同期のため、全トラックを同時にplay
   */
  async startAll(): Promise<void> {
    const promises = this.layers.map((layer) => layer.playAsync());
    await Promise.all(promises);
  }
}
```

### 5.2 SE (効果音)

| ファイル | トリガー | 長さ | 説明 |
|---|---|---|---|
| tap-perfect.wav | Perfect判定時 | 100ms | 高音のクリスタル音 "キラン" |
| tap-great.wav | Great判定時 | 80ms | 中音の打撃音 "パン" |
| tap-good.wav | Good判定時 | 80ms | 低音の打撃音 "ポン" |
| tap-miss.wav | Miss判定時 | 150ms | 不協和音 "ブッ" |
| combo-5.wav | コンボ5到達 | 200ms | 上昇音 "ティロリン" |
| combo-10.wav | コンボ10到達 | 300ms | 上昇音+ベル "ティロリロン" |
| combo-25.wav | コンボ25到達 | 400ms | ファンファーレ短 |
| combo-50.wav | コンボ50到達 | 500ms | ファンファーレ+歓声 |
| layer-up.wav | レイヤー追加時 | 300ms | ライザー音 "フワーン" |
| layer-down.wav | レイヤー減少時 | 500ms | ダウナー音 "シュウゥン" |
| enemy-explode.wav | 敵撃破時 | 150ms | 爆発音 "パァン" |
| stage-clear.wav | ステージクリア | 2000ms | クリアジングル |
| game-over.wav | ゲームオーバー | 1500ms | 下降音+ノイズ |

**SE再生ポリシー**:
- SEはBGMとは別チャンネルで再生（expo-avのAudio.Sound別インスタンス）
- 同一SEの重複再生を許可（高速タップ対応、最大4重複）
- SE音量はBGM音量の1.2倍（SEが埋もれないように）

### 5.3 コンボ維持時の音色変化

コンボが続くほど、敵撃破SEにフィルターを適用する概念設計:

| コンボ | 音色変化 | 実装方法 |
|---|---|---|
| 0-9 | 基本音 | tap-perfect.wav そのまま |
| 10-24 | やや明るい | 再生レート 1.05x |
| 25-49 | 明るい+リバーブ感 | 再生レート 1.1x |
| 50+ | 最高に華やか | 再生レート 1.15x + volume 1.0 |

実装: `expo-av` の `Audio.Sound.setRateAsync(rate, shouldCorrectPitch: false)` で再生速度を微調整し、ピッチが上がることで音色変化を表現する。

---

## 6. 収益化設計

### 6.1 AdMob配置

| 広告タイプ | 表示タイミング | 頻度 | 広告ユニットID |
|---|---|---|---|
| インタースティシャル | リザルト画面表示時 | 3プレイに1回 | ca-app-pub-XXX/interstitial |
| リワード動画 | リザルト画面の「スコア2倍」ボタン | ユーザー任意 | ca-app-pub-XXX/rewarded |
| リワード動画 | ゲームオーバー時の「コンティニュー」ボタン | ユーザー任意 | ca-app-pub-XXX/rewarded2 |

**広告表示ルール**:
- 広告除去IAP購入者には一切表示しない
- シーズンパス購入者にも一切表示しない
- インタースティシャルはプレイカウント `% 3 === 0` の時のみ
- リワード動画は事前ロード（ゲーム開始時にpreload）
- 広告ロード失敗時はボタンを非表示にし、フォールバックなし

**実装** (`react-native-google-mobile-ads`):

```typescript
// リワード動画プリロード
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const rewardedAd = RewardedAd.createForAdRequest(
  __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXX/rewarded'
);

// ゲーム開始時にロード
rewardedAd.load();

// リザルト画面でスコア2倍ボタンタップ時
rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
  gameStore.addScore(gameStore.score); // スコア2倍
});
rewardedAd.show();
```

### 6.2 IAP商品リスト

| 商品ID | 商品名 | タイプ | 価格 | 内容 |
|---|---|---|---|---|
| `bp_remove_ads` | 広告除去 | non_consumable | ¥980 | 全広告を永久に非表示 |
| `bp_season_pass` | シーズンパス | subscription (月額) | ¥1,480/月 | 全楽曲+全スキン+広告除去 |
| `bp_song_edm_pack` | EDM楽曲パック | non_consumable | ¥490 | EDM楽曲3曲 |
| `bp_song_jpop_pack` | J-Pop楽曲パック | non_consumable | ¥490 | J-Pop楽曲3曲 |
| `bp_skin_fire` | Fire スキン | non_consumable | ¥250 | 炎エフェクトスキン |
| `bp_skin_ice` | Ice スキン | non_consumable | ¥250 | 氷エフェクトスキン |
| `bp_skin_galaxy` | Galaxy スキン | non_consumable | ¥250 | 銀河エフェクトスキン |

### 6.3 RevenueCat統合

```typescript
// src/hooks/usePurchase.ts
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_KEY = Platform.OS === 'ios'
  ? Constants.expoConfig?.extra?.revenueCatApiKeyIos
  : Constants.expoConfig?.extra?.revenueCatApiKeyAndroid;

export function usePurchase() {
  const init = async () => {
    Purchases.configure({ apiKey: API_KEY! });
  };

  const getOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  };

  const purchase = async (pkg: PurchasesPackage) => {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  };

  const restorePurchases = async () => {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  };

  const checkEntitlement = async (entitlementId: string): Promise<boolean> => {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[entitlementId] !== undefined;
  };

  return { init, getOfferings, purchase, restorePurchases, checkEntitlement };
}
```

**RevenueCat Entitlement設計**:

| Entitlement ID | 含まれる商品 | 効果 |
|---|---|---|
| `ad_free` | bp_remove_ads, bp_season_pass | 広告非表示 |
| `all_songs` | bp_season_pass | 全楽曲アンロック |
| `all_skins` | bp_season_pass | 全スキンアンロック |
| `edm_pack` | bp_song_edm_pack, bp_season_pass | EDM楽曲アンロック |
| `jpop_pack` | bp_song_jpop_pack, bp_season_pass | J-Pop楽曲アンロック |
| `skin_fire` | bp_skin_fire, bp_season_pass | Fireスキン |
| `skin_ice` | bp_skin_ice, bp_season_pass | Iceスキン |
| `skin_galaxy` | bp_skin_galaxy, bp_season_pass | Galaxyスキン |

---

## 7. アプリ特有機能

### 7.1 ハプティクス (`src/hooks/useHaptics.ts`)

```typescript
import * as Haptics from 'expo-haptics';

/** 判定別の振動パターン */
export const HAPTIC_PATTERNS = {
  /** Perfect: 短く鋭い振動 */
  perfect: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  /** Great: 中程度の振動 */
  great: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  /** Good: やや重い振動 */
  good: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  /** Miss: エラー振動 (3回連続) */
  miss: async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },

  /** コンボマイルストーン到達: 成功振動 */
  comboMilestone: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  /** レイヤーアップ: 選択振動 */
  layerUp: () =>
    Haptics.selectionAsync(),

  /** ボタンタップ: 軽い振動 */
  buttonTap: () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  /** ゲームオーバー: 重い振動 */
  gameOver: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(r => setTimeout(r, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(r => setTimeout(r, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  },
} as const;
```

**ハプティクス設定**: 設定画面でON/OFF切り替え可能。AsyncStorage `@bp:settings` に保存。

### 7.2 プッシュ通知

| トリガー | 条件 | メッセージ | 送信タイミング |
|---|---|---|---|
| 復帰促進 | 72時間プレイなし | "🎵 新しいリズムが待ってる！戻ってきて音撃しよう" | 72h後 |
| デイリーリマインダー | ユーザーが設定でON | "⏰ 今日のリズムチャレンジ、まだやってないよ！" | 設定時刻 |
| 新コンテンツ | アプリ更新後初回起動時 | "🆕 新楽曲「{曲名}」追加！プレイしてみよう" | 即時 (ローカル通知) |
| 実績解除間近 | 実績の進捗が80%以上 | "🏆 あと少しで「{実績名}」達成！チャレンジしよう" | 48h後 |

**実装**: 全てローカル通知 (`expo-notifications`)。サーバー不要。

```typescript
import * as Notifications from 'expo-notifications';

// 復帰促進通知のスケジュール
async function scheduleReturnNotification(): Promise<void> {
  // 既存の復帰通知をキャンセル
  await Notifications.cancelScheduledNotificationAsync('return-reminder');

  await Notifications.scheduleNotificationAsync({
    identifier: 'return-reminder',
    content: {
      title: '音撃パルス',
      body: '🎵 新しいリズムが待ってる！戻ってきて音撃しよう',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 72 * 60 * 60, // 72時間後
    },
  });
}

// プレイ終了時に呼ぶ (次回プレイ時に再スケジュールされる)
```

### 7.3 Game Center / Google Play Games

**実績リスト** (詳細は [10.3 実績定義](#103-実績10個) を参照):

| 実績ID | プラットフォームID (iOS) | プラットフォームID (Android) |
|---|---|---|
| first_clear | grp.bp.first_clear | CgkI_xxx_first_clear |
| combo_master | grp.bp.combo_master | CgkI_xxx_combo_master |
| perfect_run | grp.bp.perfect_run | CgkI_xxx_perfect_run |
| all_songs | grp.bp.all_songs | CgkI_xxx_all_songs |
| boss_slayer | grp.bp.boss_slayer | CgkI_xxx_boss_slayer |
| layer_master | grp.bp.layer_master | CgkI_xxx_layer_master |
| thousand_kills | grp.bp.thousand_kills | CgkI_xxx_thousand_kills |
| score_hunter | grp.bp.score_hunter | CgkI_xxx_score_hunter |
| dedicated | grp.bp.dedicated | CgkI_xxx_dedicated |
| hidden_master | grp.bp.hidden_master | CgkI_xxx_hidden_master |

**リーダーボード**:

| リーダーボードID | 名前 | スコアタイプ |
|---|---|---|
| `bp_leaderboard_neon_rush` | Neon Rush ハイスコア | 最大値 |
| `bp_leaderboard_midnight_pulse` | Midnight Pulse ハイスコア | 最大値 |
| `bp_leaderboard_cyber_storm` | Cyber Storm ハイスコア | 最大値 |
| `bp_leaderboard_total` | 累計スコア | 最大値 |

### 7.4 ウィジェット

**iOS WidgetKit / Android Glance Widget**:

表示内容:
```
┌─────────────────────┐
│ 🎵 音撃パルス        │
│                     │
│ BEST: 128,450       │  ← 全曲ベストスコア合計
│ 🏆 RANK S × 1      │  ← Sランク獲得数
│ 🔥 COMBO: 82       │  ← 歴代最大コンボ
│                     │
│ TAP TO PLAY         │  ← タップでアプリ起動
└─────────────────────┘
```

サイズ: Small (2x2) のみ。
データ更新: プレイ終了時に `SharedGroupPreferences` (iOS) / `SharedPreferences` (Android) に最新データを書き込み、ウィジェットを更新。

**注意**: React Native単体ではウィジェットを作れないため、ネイティブモジュール (Swift / Kotlin) で実装する必要がある。v1.0では対応せず、v1.1以降の機能とする。

### 7.5 レビュー依頼

**トリガー条件** (全て満たした時に1回だけ表示):
1. 累計プレイ回数が5回以上
2. Sランクを1回以上獲得
3. 前回のレビュー依頼から30日以上経過 (初回は条件なし)
4. 今回のプレイがクリアで終了した

```typescript
import * as StoreReview from 'expo-store-review';

async function maybeRequestReview(): Promise<void> {
  const playCount = await getStorageValue('@bp:play_count');
  const sRankCount = await getStorageValue('@bp:s_rank_count');
  const lastReviewRequest = await getStorageValue('@bp:last_review_request');
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  if (
    playCount >= 5 &&
    sRankCount >= 1 &&
    (!lastReviewRequest || now - lastReviewRequest > thirtyDays)
  ) {
    const isAvailable = await StoreReview.isAvailableAsync();
    if (isAvailable) {
      await StoreReview.requestReview();
      await setStorageValue('@bp:last_review_request', now);
    }
  }
}
```

---

## 8. データ永続化

### 8.1 AsyncStorageキー設計

全てのキーは `@bp:` プレフィックスを付与する。

| キー | データ型 | 初期値 | 説明 |
|---|---|---|---|
| `@bp:player` | `PlayerData` | (下記) | プレイヤーの全永続データ |
| `@bp:settings` | `Settings` | (下記) | アプリ設定 |
| `@bp:achievements` | `AchievementProgress[]` | `[]` | 実績進捗 |
| `@bp:play_count` | `number` | `0` | 累計プレイ回数 |
| `@bp:last_review_request` | `number \| null` | `null` | 最後のレビュー依頼時刻 (ms) |
| `@bp:first_launch` | `string` | ISO8601 | 初回起動日時 |
| `@bp:last_play` | `string` | ISO8601 | 最後にプレイした日時 |

### 8.2 データ形状

```typescript
/** @bp:player */
interface PlayerData {
  /** 各楽曲のベストスコア */
  bestScores: Record<string, {
    score: number;
    maxCombo: number;
    perfectRate: number;
    rank: "S" | "A" | "B" | "C" | "D";
    clearedAt: string; // ISO8601
  }>;
  /** アンロック済みの楽曲IDリスト */
  unlockedSongs: string[];
  /** アンロック済みのスキンIDリスト */
  unlockedSkins: string[];
  /** 現在選択中のスキンID */
  currentSkinId: string;
  /** 累計スコア */
  totalScore: number;
  /** 歴代最大コンボ */
  allTimeMaxCombo: number;
  /** 累計撃破数 */
  totalKills: number;
  /** 累計Perfect数 */
  totalPerfects: number;
}

/** PlayerDataの初期値 */
const DEFAULT_PLAYER_DATA: PlayerData = {
  bestScores: {},
  unlockedSongs: ["neon-rush"], // 初期楽曲のみアンロック
  unlockedSkins: ["default"],   // デフォルトスキンのみ
  currentSkinId: "default",
  totalScore: 0,
  allTimeMaxCombo: 0,
  totalKills: 0,
  totalPerfects: 0,
};

/** @bp:settings */
interface Settings {
  /** BGM音量 (0.0-1.0) */
  bgmVolume: number;
  /** SE音量 (0.0-1.0) */
  seVolume: number;
  /** ハプティクスON/OFF */
  hapticsEnabled: boolean;
  /** 通知ON/OFF */
  notificationsEnabled: boolean;
  /** 判定タイミング補正 (ms, -50〜+50) */
  timingOffset: number;
}

/** Settingsの初期値 */
const DEFAULT_SETTINGS: Settings = {
  bgmVolume: 0.8,
  seVolume: 1.0,
  hapticsEnabled: true,
  notificationsEnabled: true,
  timingOffset: 0,
};
```

### 8.3 ストレージラッパー

```typescript
// src/hooks/useStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getStorageValue<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  return JSON.parse(raw) as T;
}

export async function setStorageValue<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function mergeStorageValue<T extends object>(
  key: string,
  partial: Partial<T>
): Promise<void> {
  await AsyncStorage.mergeItem(key, JSON.stringify(partial));
}
```

---

## 9. シェア機能

### 9.1 スコアカード生成

**生成方法**: `react-native-view-shot` でReactコンポーネントをキャプチャし、`expo-sharing` でシェア。

**スコアカードレイアウト** (1200x630px、OGP互換):

```
┌──────────────────────────────────────────────┐
│  (背景: 楽曲テーマに合わせたグラデーション)     │
│                                              │
│      🎵 音撃パルス / BEAT PULSE              │  ← 左上にロゴ (小)
│                                              │
│       SCORE  128,450                         │  ← 中央大文字
│       RANK      S                            │     Orbitron-Bold 64px
│       COMBO    47                            │
│       PERFECT  82%                           │
│                                              │
│       ♪♪♪♪♪  FULL LAYER!                    │  ← 全レイヤー達成時のみ
│                                              │
│       🎵 Neon Rush (BPM 128)                │  ← 楽曲情報
│                                              │
│  #音撃パルス #BeatPulse                      │  ← ハッシュタグ
└──────────────────────────────────────────────┘
```

**実装**:

```typescript
// src/components/share/ScoreCard.tsx
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export function ShareScoreCard({ gameState, songTitle }: Props) {
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    // 1. コンポーネントをPNGとしてキャプチャ
    const uri = await viewShotRef.current?.capture();
    if (!uri) return;

    // 2. 一時ファイルにコピー
    const tempPath = `${FileSystem.cacheDirectory}score-card.png`;
    await FileSystem.copyAsync({ from: uri, to: tempPath });

    // 3. シェアシート表示
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(tempPath, {
        mimeType: 'image/png',
        dialogTitle: 'スコアをシェア',
        UTI: 'public.png',
      });
    }
  };

  return (
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0, width: 1200, height: 630 }}>
      {/* スコアカードのJSX (上記レイアウト通り) */}
    </ViewShot>
  );
}
```

### 9.2 15秒リプレイ動画

**v1.0では画像シェアのみ対応。** リプレイ動画はv1.1以降で実装予定。

v1.1の設計方針:
- ゲームプレイ中の最後の15秒間のゲーム状態を配列に記録（60fps × 15秒 = 900フレーム分のEnemyPosition + JudgmentResult）
- リプレイ画面でそのデータを再生しながら `react-native-view-shot` の `captureRef` で連続キャプチャ
- `FFmpeg` (react-native-ffmpeg) で画像列をMP4に変換
- ファイルサイズ目標: 5MB以下

### 9.3 シェアテキストテンプレート

```typescript
const SHARE_TEMPLATES = {
  /** クリア時のシェアテキスト */
  clear: (score: number, rank: string, songTitle: string) =>
    `🎵 ${songTitle} をクリア！\n` +
    `Score: ${score.toLocaleString()} | Rank: ${rank}\n` +
    `#音撃パルス #BeatPulse\n` +
    `https://apps.apple.com/app/idXXXXXXXXXX`,

  /** Sランク達成時 */
  sRank: (score: number, songTitle: string) =>
    `✨ Sランク達成！✨\n` +
    `🎵 ${songTitle}\n` +
    `Score: ${score.toLocaleString()}\n` +
    `#音撃パルス #BeatPulse\n` +
    `https://apps.apple.com/app/idXXXXXXXXXX`,

  /** フルコンボ達成時 */
  fullCombo: (combo: number, songTitle: string) =>
    `🔥 フルコンボ ${combo}！🔥\n` +
    `🎵 ${songTitle}\n` +
    `全ノートPerfect率: 100%\n` +
    `#音撃パルス #BeatPulse\n` +
    `https://apps.apple.com/app/idXXXXXXXXXX`,

  /** 実績解除時 */
  achievement: (achievementName: string) =>
    `🏆 実績「${achievementName}」を解除！\n` +
    `#音撃パルス #BeatPulse\n` +
    `https://apps.apple.com/app/idXXXXXXXXXX`,
} as const;
```

---

## 10. 初期コンテンツ

### 10.1 楽曲3曲の詳細定義

#### 楽曲1: Neon Rush

```json
{
  "id": "neon-rush",
  "title": "Neon Rush",
  "artist": "Beat Pulse Original",
  "bpm": 128,
  "durationMs": 120000,
  "difficulty": 3,
  "difficultyLabel": "Normal",
  "layers": [
    { "id": 0, "name": "drums",  "audioFile": "assets/audio/bgm/neon-rush/drums.mp3",  "comboThreshold": 0,  "volume": 0.8 },
    { "id": 1, "name": "bass",   "audioFile": "assets/audio/bgm/neon-rush/bass.mp3",   "comboThreshold": 5,  "volume": 0.0 },
    { "id": 2, "name": "melody", "audioFile": "assets/audio/bgm/neon-rush/melody.mp3", "comboThreshold": 15, "volume": 0.0 },
    { "id": 3, "name": "chorus", "audioFile": "assets/audio/bgm/neon-rush/chorus.mp3", "comboThreshold": 30, "volume": 0.0 },
    { "id": 4, "name": "fx",     "audioFile": "assets/audio/bgm/neon-rush/fx.mp3",     "comboThreshold": 50, "volume": 0.0 }
  ],
  "unlockCondition": { "type": "default" },
  "thumbnailImage": "assets/images/songs/neon-rush-thumb.png",
  "previewAudioFile": "assets/audio/bgm/neon-rush/preview.mp3",
  "notes": [
    { "timeMs":  3750, "direction": "N",  "enemyType": "normal", "travelTimeMs": 2000 },
    { "timeMs":  4688, "direction": "E",  "enemyType": "normal", "travelTimeMs": 2000 },
    { "timeMs":  5625, "direction": "S",  "enemyType": "normal", "travelTimeMs": 2000 },
    { "timeMs":  6563, "direction": "W",  "enemyType": "normal", "travelTimeMs": 2000 },
    { "timeMs":  7500, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1800 },
    { "timeMs":  8438, "direction": "SE", "enemyType": "normal", "travelTimeMs": 1800 },
    { "timeMs":  9375, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1800 },
    { "timeMs": 10313, "direction": "NE", "enemyType": "normal", "travelTimeMs": 1800 },
    { "timeMs": 11250, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1600 },
    { "timeMs": 11719, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1600 },
    { "timeMs": 12188, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1600 },
    { "timeMs": 12656, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1600 },
    { "timeMs": 14063, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 14531, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 15000, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 15469, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 15938, "direction": "E",  "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 16875, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 17813, "direction": "NW", "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 18750, "direction": "SE", "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 22500, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 22969, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 23438, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 23906, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 24375, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 24844, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 25313, "direction": "NW", "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 25781, "direction": "SE", "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 28125, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2500 },
    { "timeMs": 29063, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 29531, "direction": "E",  "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 30000, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 30469, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1200 },
    { "timeMs": 30938, "direction": "SW", "enemyType": "normal", "travelTimeMs": 1500 },
    { "timeMs": 33750, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1400 },
    { "timeMs": 34219, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1400 },
    { "timeMs": 34688, "direction": "N",  "enemyType": "fast",   "travelTimeMs": 1100 },
    { "timeMs": 35156, "direction": "S",  "enemyType": "fast",   "travelTimeMs": 1100 },
    { "timeMs": 35625, "direction": "NE", "enemyType": "normal", "travelTimeMs": 1400 },
    { "timeMs": 36094, "direction": "SW", "enemyType": "normal", "travelTimeMs": 1400 },
    { "timeMs": 36563, "direction": "SE", "enemyType": "fast",   "travelTimeMs": 1100 },
    { "timeMs": 37031, "direction": "NW", "enemyType": "fast",   "travelTimeMs": 1100 },
    { "timeMs": 39375, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2500 },
    { "timeMs": 39844, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1400 },
    { "timeMs": 40313, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1400 },
    { "timeMs": 40781, "direction": "W",  "enemyType": "split",  "travelTimeMs": 1800 },
    { "timeMs": 41250, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1100 },
    { "timeMs": 41719, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 1100 },
    { "timeMs": 45000, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1300 },
    { "timeMs": 45234, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1300 },
    { "timeMs": 45469, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1300 },
    { "timeMs": 45703, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1300 },
    { "timeMs": 45938, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 46172, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 46406, "direction": "SE", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 46641, "direction": "NW", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 50625, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2500 },
    { "timeMs": 50625, "direction": "S",  "enemyType": "heavy",  "travelTimeMs": 2500 },
    { "timeMs": 51563, "direction": "E",  "enemyType": "split",  "travelTimeMs": 1800 },
    { "timeMs": 52031, "direction": "W",  "enemyType": "split",  "travelTimeMs": 1800 },
    { "timeMs": 52500, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 52969, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 56250, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1200 },
    { "timeMs": 56484, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1200 },
    { "timeMs": 56719, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1200 },
    { "timeMs": 56953, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1200 },
    { "timeMs": 57188, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 57422, "direction": "SE", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 57656, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 57891, "direction": "NW", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 61875, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2200 },
    { "timeMs": 62344, "direction": "E",  "enemyType": "split",  "travelTimeMs": 1600 },
    { "timeMs": 62813, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1200 },
    { "timeMs": 63281, "direction": "W",  "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 63750, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 1000 },
    { "timeMs": 64219, "direction": "SW", "enemyType": "normal", "travelTimeMs": 1200 },
    { "timeMs": 64688, "direction": "SE", "enemyType": "split",  "travelTimeMs": 1600 },
    { "timeMs": 67500, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 67734, "direction": "NE", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 67969, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 68203, "direction": "SE", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 68438, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 68672, "direction": "SW", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 68906, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 69141, "direction": "NW", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 73125, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2200 },
    { "timeMs": 73125, "direction": "S",  "enemyType": "heavy",  "travelTimeMs": 2200 },
    { "timeMs": 73594, "direction": "E",  "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 74063, "direction": "W",  "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 74531, "direction": "NE", "enemyType": "split",  "travelTimeMs": 1500 },
    { "timeMs": 75000, "direction": "SW", "enemyType": "split",  "travelTimeMs": 1500 },
    { "timeMs": 78750, "direction": "N",  "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 78984, "direction": "E",  "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 79219, "direction": "S",  "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 79453, "direction": "W",  "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 79688, "direction": "NE", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 79922, "direction": "SE", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 80156, "direction": "SW", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 80391, "direction": "NW", "enemyType": "normal", "travelTimeMs": 1100 },
    { "timeMs": 84375, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2000 },
    { "timeMs": 84844, "direction": "E",  "enemyType": "heavy",  "travelTimeMs": 2000 },
    { "timeMs": 85313, "direction": "S",  "enemyType": "split",  "travelTimeMs": 1500 },
    { "timeMs": 85781, "direction": "W",  "enemyType": "split",  "travelTimeMs": 1500 },
    { "timeMs": 86250, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 86484, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 86719, "direction": "SE", "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 86953, "direction": "NW", "enemyType": "fast",   "travelTimeMs": 900 },
    { "timeMs": 90000, "direction": "N",  "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 90234, "direction": "E",  "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 90469, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 90703, "direction": "W",  "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 90938, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 91172, "direction": "SE", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 91406, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 91641, "direction": "NW", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 95625, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2000 },
    { "timeMs": 95625, "direction": "E",  "enemyType": "heavy",  "travelTimeMs": 2000 },
    { "timeMs": 95625, "direction": "S",  "enemyType": "heavy",  "travelTimeMs": 2000 },
    { "timeMs": 96094, "direction": "W",  "enemyType": "split",  "travelTimeMs": 1500 },
    { "timeMs": 96563, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 97031, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 101250, "direction": "N", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 101484, "direction": "E", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 101719, "direction": "S", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 101953, "direction": "W", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 102188, "direction": "NE", "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 102422, "direction": "SE", "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 102656, "direction": "SW", "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 102891, "direction": "NW", "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 106875, "direction": "N",  "enemyType": "heavy",  "travelTimeMs": 2000 },
    { "timeMs": 106875, "direction": "S",  "enemyType": "heavy",  "travelTimeMs": 2000 },
    { "timeMs": 107344, "direction": "E",  "enemyType": "split",  "travelTimeMs": 1500 },
    { "timeMs": 107813, "direction": "W",  "enemyType": "split",  "travelTimeMs": 1500 },
    { "timeMs": 114000, "direction": "N",  "enemyType": "boss",   "travelTimeMs": 4000 },
    { "timeMs": 115000, "direction": "E",  "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 115469, "direction": "W",  "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 116406, "direction": "S",  "enemyType": "normal", "travelTimeMs": 1000 },
    { "timeMs": 117344, "direction": "NE", "enemyType": "fast",   "travelTimeMs": 800 },
    { "timeMs": 117813, "direction": "SW", "enemyType": "fast",   "travelTimeMs": 800 }
  ]
}
```

**ノート総数**: 120ノート (2分間、BPM128、平均1ノート/秒)

#### 楽曲2: Midnight Pulse

```json
{
  "id": "midnight-pulse",
  "title": "Midnight Pulse",
  "artist": "Beat Pulse Original",
  "bpm": 140,
  "durationMs": 150000,
  "difficulty": 6,
  "difficultyLabel": "Hard",
  "layers": [
    { "id": 0, "name": "drums",  "audioFile": "assets/audio/bgm/midnight-pulse/drums.mp3",  "comboThreshold": 0,  "volume": 0.8 },
    { "id": 1, "name": "bass",   "audioFile": "assets/audio/bgm/midnight-pulse/bass.mp3",   "comboThreshold": 5,  "volume": 0.0 },
    { "id": 2, "name": "melody", "audioFile": "assets/audio/bgm/midnight-pulse/melody.mp3", "comboThreshold": 15, "volume": 0.0 },
    { "id": 3, "name": "chorus", "audioFile": "assets/audio/bgm/midnight-pulse/chorus.mp3", "comboThreshold": 30, "volume": 0.0 },
    { "id": 4, "name": "fx",     "audioFile": "assets/audio/bgm/midnight-pulse/fx.mp3",     "comboThreshold": 50, "volume": 0.0 }
  ],
  "unlockCondition": { "type": "clear", "requiredSongId": "neon-rush" },
  "thumbnailImage": "assets/images/songs/midnight-pulse-thumb.png",
  "previewAudioFile": "assets/audio/bgm/midnight-pulse/preview.mp3"
}
```

**ノートパターン特徴** (150ノート、2分30秒):
- イントロ (0-30s): normal中心、4方向のみ、間隔ゆったり (857ms/beat = BPM140の2拍)
- 序盤 (30-60s): fast敵混合、8方向使用開始、交互パターン (N→S→E→W)
- 中盤 (60-90s): heavy登場、2体同時出現、回転パターン (N→NE→E→SE→S→...)
- 後半 (90-120s): split大量、3体同時出現、ジグザグパターン
- クライマックス (120-142s): 全敵種、4体同時、ランダム方向
- ボス (142-150s): boss1体 + fast支援2体

#### 楽曲3: Cyber Storm

```json
{
  "id": "cyber-storm",
  "title": "Cyber Storm",
  "artist": "Beat Pulse Original",
  "bpm": 160,
  "durationMs": 180000,
  "difficulty": 9,
  "difficultyLabel": "Expert",
  "layers": [
    { "id": 0, "name": "drums",  "audioFile": "assets/audio/bgm/cyber-storm/drums.mp3",  "comboThreshold": 0,  "volume": 0.8 },
    { "id": 1, "name": "bass",   "audioFile": "assets/audio/bgm/cyber-storm/bass.mp3",   "comboThreshold": 5,  "volume": 0.0 },
    { "id": 2, "name": "melody", "audioFile": "assets/audio/bgm/cyber-storm/melody.mp3", "comboThreshold": 15, "volume": 0.0 },
    { "id": 3, "name": "chorus", "audioFile": "assets/audio/bgm/cyber-storm/chorus.mp3", "comboThreshold": 30, "volume": 0.0 },
    { "id": 4, "name": "fx",     "audioFile": "assets/audio/bgm/cyber-storm/fx.mp3",     "comboThreshold": 50, "volume": 0.0 }
  ],
  "unlockCondition": { "type": "clear", "requiredSongId": "midnight-pulse" },
  "thumbnailImage": "assets/images/songs/cyber-storm-thumb.png",
  "previewAudioFile": "assets/audio/bgm/cyber-storm/preview.mp3"
}
```

**ノートパターン特徴** (200ノート、3分):
- イントロ (0-36s): normal+fast交互、テンポ速いが密度は低め
- 序盤 (36-72s): 8方向フル活用、heavy2体同時パターン
- 中盤 (72-108s): split連打、4体同時出現、螺旋パターン
- 後半 (108-144s): 全敵種ランダム、5体同時、travelTime最短800ms
- クライマックス (144-171s): 密度最大（375ms/ノート = 1拍に1体）
- ボス (171-180s): boss2体同時 + normal支援3体

### 10.2 スキン5種の定義

```typescript
// src/data/skins.ts
import { SkinDef } from "../types";

export const SKINS: SkinDef[] = [
  {
    id: "default",
    name: "Default",
    description: "シンプルなネオンパルス",
    category: "pulse",
    previewImage: "assets/images/skins/default/preview.png",
    unlockCondition: { type: "default" },
    effectParams: {
      primaryColor: "#FF00FF",
      secondaryColor: "#00FFFF",
      particleCount: 8,
      particleSize: 4,
      glowRadius: 20,
      animationSpeed: 1.0,
    },
  },
  {
    id: "neon",
    name: "Neon Blaze",
    description: "鮮烈なネオンの輝き。判定エフェクトがネオンサインのように発光",
    category: "hitEffect",
    previewImage: "assets/images/skins/neon/preview.png",
    unlockCondition: { type: "combo", requiredCombo: 30 },
    effectParams: {
      primaryColor: "#39FF14",
      secondaryColor: "#FF073A",
      particleCount: 12,
      particleSize: 5,
      glowRadius: 30,
      animationSpeed: 1.2,
    },
  },
  {
    id: "fire",
    name: "Inferno",
    description: "炎が敵を焼き尽くす。撃破時に火の粉が飛び散る",
    category: "hitEffect",
    previewImage: "assets/images/skins/fire/preview.png",
    unlockCondition: { type: "purchase", iapProductId: "bp_skin_fire" },
    effectParams: {
      primaryColor: "#FF4500",
      secondaryColor: "#FFD700",
      particleCount: 16,
      particleSize: 6,
      glowRadius: 35,
      animationSpeed: 1.5,
    },
  },
  {
    id: "ice",
    name: "Frost Wave",
    description: "氷の結晶が敵を凍らせる。クールなブルーエフェクト",
    category: "hitEffect",
    previewImage: "assets/images/skins/ice/preview.png",
    unlockCondition: { type: "purchase", iapProductId: "bp_skin_ice" },
    effectParams: {
      primaryColor: "#00BFFF",
      secondaryColor: "#E0FFFF",
      particleCount: 12,
      particleSize: 5,
      glowRadius: 25,
      animationSpeed: 0.8,
    },
  },
  {
    id: "galaxy",
    name: "Cosmic Pulse",
    description: "宇宙の神秘。星屑が敵を包み込む銀河エフェクト",
    category: "trail",
    previewImage: "assets/images/skins/galaxy/preview.png",
    unlockCondition: { type: "purchase", iapProductId: "bp_skin_galaxy" },
    effectParams: {
      primaryColor: "#9B59B6",
      secondaryColor: "#F39C12",
      particleCount: 20,
      particleSize: 3,
      glowRadius: 40,
      animationSpeed: 0.6,
    },
  },
];
```

### 10.3 実績10個の定義

```typescript
// src/data/achievements.ts
import { Achievement } from "../types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_clear",
    name: "はじめの一歩",
    description: "楽曲を初めてクリアする",
    icon: "🎵",
    conditionType: "songs_cleared",
    conditionValue: 1,
    reward: { type: "title", id: "title_beginner" },
    platformAchievementId: {
      ios: "grp.bp.first_clear",
      android: "CgkI_xxx_first_clear",
    },
    hidden: false,
  },
  {
    id: "combo_master",
    name: "コンボマスター",
    description: "1プレイで50コンボを達成する",
    icon: "🔥",
    conditionType: "max_combo",
    conditionValue: 50,
    reward: { type: "skin", id: "neon" },
    platformAchievementId: {
      ios: "grp.bp.combo_master",
      android: "CgkI_xxx_combo_master",
    },
    hidden: false,
  },
  {
    id: "perfect_run",
    name: "完璧なリズム",
    description: "Perfect率90%以上でクリアする",
    icon: "✨",
    conditionType: "perfect_rate",
    conditionValue: 90,
    reward: { type: "coins", amount: 500 },
    platformAchievementId: {
      ios: "grp.bp.perfect_run",
      android: "CgkI_xxx_perfect_run",
    },
    hidden: false,
  },
  {
    id: "all_songs",
    name: "フルコレクション",
    description: "全ての無料楽曲をクリアする",
    icon: "🎶",
    conditionType: "songs_cleared",
    conditionValue: 3,
    reward: { type: "title", id: "title_collector" },
    platformAchievementId: {
      ios: "grp.bp.all_songs",
      android: "CgkI_xxx_all_songs",
    },
    hidden: false,
  },
  {
    id: "boss_slayer",
    name: "ボススレイヤー",
    description: "ボスを初めて撃破する",
    icon: "👑",
    conditionType: "boss_kill",
    conditionValue: 1,
    reward: { type: "coins", amount: 300 },
    platformAchievementId: {
      ios: "grp.bp.boss_slayer",
      android: "CgkI_xxx_boss_slayer",
    },
    hidden: false,
  },
  {
    id: "layer_master",
    name: "フルオーケストラ",
    description: "全5レイヤーを同時にアクティブにする",
    icon: "🎻",
    conditionType: "full_layer",
    conditionValue: 1,
    reward: { type: "title", id: "title_maestro" },
    platformAchievementId: {
      ios: "grp.bp.layer_master",
      android: "CgkI_xxx_layer_master",
    },
    hidden: false,
  },
  {
    id: "thousand_kills",
    name: "千の撃破",
    description: "累計1000体の敵を撃破する",
    icon: "💀",
    conditionType: "total_kills",
    conditionValue: 1000,
    reward: { type: "coins", amount: 1000 },
    platformAchievementId: {
      ios: "grp.bp.thousand_kills",
      android: "CgkI_xxx_thousand_kills",
    },
    hidden: false,
  },
  {
    id: "score_hunter",
    name: "スコアハンター",
    description: "累計スコア100万を達成する",
    icon: "💎",
    conditionType: "total_score",
    conditionValue: 1000000,
    reward: { type: "title", id: "title_hunter" },
    platformAchievementId: {
      ios: "grp.bp.score_hunter",
      android: "CgkI_xxx_score_hunter",
    },
    hidden: false,
  },
  {
    id: "dedicated",
    name: "リズムの求道者",
    description: "累計50回プレイする",
    icon: "🎯",
    conditionType: "play_count",
    conditionValue: 50,
    reward: { type: "coins", amount: 500 },
    platformAchievementId: {
      ios: "grp.bp.dedicated",
      android: "CgkI_xxx_dedicated",
    },
    hidden: false,
  },
  {
    id: "hidden_master",
    name: "???",
    description: "Cyber Stormをノーミスでクリアする",
    icon: "🌟",
    conditionType: "no_miss",
    conditionValue: 1,
    conditionSongId: "cyber-storm",
    reward: { type: "skin", id: "galaxy" },
    platformAchievementId: {
      ios: "grp.bp.hidden_master",
      android: "CgkI_xxx_hidden_master",
    },
    hidden: true,
  },
];
```

---

## 付録: 定数一覧

### src/constants/layout.ts

```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const SCREEN_CENTER_X = width / 2;
export const SCREEN_CENTER_Y = height / 2;

/** HUD領域の高さ */
export const HUD_HEIGHT = 60;

/** パルスリングの半径 */
export const PULSE_RING_RADIUS = 60;

/** 敵のスポーン位置のマージン (画面外) */
export const SPAWN_MARGIN = 50;
```

### src/constants/colors.ts

```typescript
export const COLORS = {
  background: "#0A0A1A",
  primary: "#FF00FF",
  secondary: "#00FFFF",
  accent: "#FFD700",

  perfect: "#FFD700",
  great: "#00FF00",
  good: "#00BFFF",
  miss: "#FF0000",

  textPrimary: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textMuted: "#666666",

  cardBackground: "rgba(255, 255, 255, 0.05)",
  cardBorder: "rgba(255, 255, 255, 0.1)",

  layerActive: "#FF00FF",
  layerInactive: "#333333",

  lifeActive: "#FF4444",
  lifeEmpty: "#333333",

  overlay: "rgba(0, 0, 0, 0.7)",
} as const;
```

### src/constants/config.ts

```typescript
export const CONFIG = {
  /** 基準移動速度 (px/sec) */
  BASE_ENEMY_SPEED: 200,

  /** タップ判定の追加マージン (px) */
  TAP_MARGIN: 60,

  /** 初期ライフ */
  INITIAL_LIFE: 5,

  /** 最大ライフ */
  MAX_LIFE: 5,

  /** コンボ倍率の上限 */
  MAX_COMBO_MULTIPLIER: 3.0,

  /** カウントダウンの各数字の表示時間 (ms) */
  COUNTDOWN_INTERVAL: 800,

  /** レイヤーフェードイン時間 (ms) */
  LAYER_FADE_IN_MS: 500,

  /** レイヤーフェードアウト時間 (ms) */
  LAYER_FADE_OUT_MS: 2000,

  /** インタースティシャル広告の表示間隔 (プレイ回数) */
  INTERSTITIAL_INTERVAL: 3,

  /** リプレイ記録フレーム数 (60fps * 15sec) */
  REPLAY_BUFFER_FRAMES: 900,

  /** スキル選択の提示数 */
  SKILL_CHOICE_COUNT: 3,

  /** 最大同時敵数 (パフォーマンス制限) */
  MAX_ENEMIES_ON_SCREEN: 20,
} as const;
```

---

## 付録: 技術的注意事項

### 音声同期の精度確保

`expo-av` はネイティブオーディオのラッパーであり、JavaScriptのタイマーに依存しない。ただし、5つのレイヤーを完全に位相同期させるためには:

1. **全レイヤーを同時にロード**: `Audio.Sound.createAsync()` を5回呼び、全てのロード完了後にまとめて `.playAsync()`
2. **再生位置の補正**: 1秒ごとに `getStatusAsync()` で各トラックの `positionMillis` をチェックし、10ms以上のずれがあれば `setPositionAsync()` で補正
3. **バックグラウンド復帰時**: `AppState` の `active` イベントで全トラックの位置を再同期

### パフォーマンス目標

- 描画フレームレート: 60fps維持 (16.67ms/frame)
- タッチ入力レイテンシ: 16ms以下 (1フレーム以内に判定処理完了)
- メモリ使用量: 200MB以下 (音声アセットが大半を占める)
- アプリサイズ: 50MB以下 (音声をAACに圧縮)

### react-native-skia の使い方

ゲーム画面の描画は `@shopify/react-native-skia` の `<Canvas>` を使用する。
UIオーバーレイ (HUD、モーダル) は通常のReact Nativeコンポーネントで描画し、`position: 'absolute'` で `Canvas` の上に重ねる。

```tsx
// app/game.tsx のレイアウト構造
<View style={{ flex: 1 }}>
  {/* Skia Canvas: 敵、パルスリング、エフェクトを描画 */}
  <Canvas style={{ flex: 1 }}>
    <PulseRing />
    {enemies.map(e => <EnemyRenderer key={e.id} enemy={e} />)}
    {judgmentEffects.map(j => <JudgmentEffect key={j.id} result={j} />)}
  </Canvas>

  {/* HUD オーバーレイ */}
  <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
    <ScoreDisplay score={score} />
    <LayerIndicator layers={layers} />
    <ComboDisplay combo={combo} />
    <ProgressBar progress={elapsedMs / durationMs} />
  </View>

  {/* ライフ表示 */}
  <View style={{ position: 'absolute', bottom: 40, left: 16 }}>
    <LifeDisplay life={life} maxLife={maxLife} />
  </View>

  {/* 一時停止ボタン */}
  <TouchableOpacity style={{ position: 'absolute', bottom: 40, right: 16 }}>
    <PauseIcon />
  </TouchableOpacity>

  {/* 判定テキスト */}
  <View style={{ position: 'absolute', bottom: '30%', alignSelf: 'center' }}>
    <JudgmentText judgment={lastJudgment} />
  </View>
</View>
```

---

**End of Design Document**
