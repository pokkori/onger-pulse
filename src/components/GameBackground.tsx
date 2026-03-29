/**
 * 音撃パルス ゲーム背景: サイバーネオンメッシュ
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect, Defs, RadialGradient, Stop, LinearGradient, Circle, Line,
} from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

interface GameBackgroundProps {
  fever?: boolean;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ fever = false }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="baseBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0A0A1A" />
            <Stop offset="50%" stopColor={fever ? '#1A0530' : '#0D0D25'} />
            <Stop offset="100%" stopColor="#050510" />
          </LinearGradient>
          <RadialGradient id="cyanPulse" cx="30%" cy="25%" r="40%">
            <Stop offset="0%" stopColor="#00F5FF" stopOpacity={fever ? '0.25' : '0.12'} />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="pinkPulse" cx="70%" cy="70%" r="40%">
            <Stop offset="0%" stopColor="#FF6B9D" stopOpacity={fever ? '0.25' : '0.12'} />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="purplePulse" cx="50%" cy="50%" r="35%">
            <Stop offset="0%" stopColor="#C850C0" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width={W} height={H} fill="url(#baseBg)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#cyanPulse)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#pinkPulse)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#purplePulse)" />

        {/* Grid lines for cyber aesthetic */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Line
            key={`h${i}`}
            x1="0"
            y1={H * 0.6 + i * 30}
            x2={W}
            y2={H * 0.6 + i * 30 + 15}
            stroke="#00F5FF"
            strokeWidth="0.5"
            opacity={0.06 - i * 0.005}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <Line
            key={`v${i}`}
            x1={W * (i + 1) / 7}
            y1={H * 0.6}
            x2={W * (i + 1) / 7 + (i % 2 === 0 ? -20 : 20)}
            y2={H}
            stroke="#FF6B9D"
            strokeWidth="0.5"
            opacity={0.04}
          />
        ))}
      </Svg>
    </View>
  );
};
