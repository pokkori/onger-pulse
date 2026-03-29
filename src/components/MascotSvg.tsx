/**
 * 音撃パルス マスコット: DJロボ「パルスくん」
 * ヘッドホン付きのかわいいDJロボット
 */
import React from 'react';
import Svg, {
  Circle, Ellipse, Rect, Path, G, Defs, LinearGradient, RadialGradient, Stop,
} from 'react-native-svg';

interface MascotSvgProps {
  size?: number;
  beatPhase?: 'idle' | 'beat' | 'drop';
}

export const MascotSvg: React.FC<MascotSvgProps> = ({ size = 120, beatPhase = 'idle' }) => {
  const isBeat = beatPhase === 'beat';
  const isDrop = beatPhase === 'drop';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      accessibilityLabel="パルスくん（DJロボマスコット）"
    >
      <Defs>
        <LinearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#2D2D5E" />
          <Stop offset="100%" stopColor="#1A1A3E" />
        </LinearGradient>
        <LinearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#00F5FF" />
          <Stop offset="100%" stopColor="#0088FF" />
        </LinearGradient>
        <LinearGradient id="neonPink" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FF6B9D" />
          <Stop offset="100%" stopColor="#C850C0" />
        </LinearGradient>
        <RadialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={isDrop ? '#FF6B9D' : '#00F5FF'} stopOpacity="0.6" />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Glow behind head */}
      <Circle cx="60" cy="50" r="35" fill="url(#screenGlow)" opacity={isBeat ? 0.8 : 0.3} />

      {/* Antenna */}
      <Path d="M60 18 L60 8" stroke="#00F5FF" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="60" cy="6" r="3" fill={isDrop ? '#FF6B9D' : '#00F5FF'} />
      {isBeat && <Circle cx="60" cy="6" r="6" fill={isDrop ? '#FF6B9D' : '#00F5FF'} opacity={0.3} />}

      {/* Headphone band */}
      <Path
        d="M28 45 Q28 22 60 20 Q92 22 92 45"
        stroke="#444466"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Head (rounded rectangle) */}
      <Rect x="35" y="30" width="50" height="42" rx="14" fill="url(#robotBody)" stroke="#3D3D6E" strokeWidth="1.5" />

      {/* Visor / screen face */}
      <Rect x="40" y="36" width="40" height="22" rx="8" fill="#0A0A1A" />
      <Rect x="40" y="36" width="40" height="22" rx="8" fill="url(#screenGlow)" opacity={0.2} />

      {/* Eyes on visor */}
      <G>
        {/* Left eye */}
        <Rect x="46" y="42" width="8" height={isBeat ? 6 : 10} rx="2"
          fill={isDrop ? '#FF6B9D' : '#00F5FF'} />
        {/* Right eye */}
        <Rect x="66" y="42" width="8" height={isBeat ? 6 : 10} rx="2"
          fill={isDrop ? '#FF6B9D' : '#00F5FF'} />
      </G>

      {/* Equalizer bars on visor (bottom) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const barH = isBeat ? [4, 8, 6, 9, 5][i] : [3, 5, 7, 4, 6][i];
        return (
          <Rect
            key={i}
            x={44 + i * 7}
            y={55 - barH}
            width="4"
            height={barH}
            rx="1"
            fill={isDrop ? '#FF6B9D' : '#00F5FF'}
            opacity={0.5}
          />
        );
      })}

      {/* Headphone ear cups */}
      <G>
        {/* Left cup */}
        <Ellipse cx="30" cy="48" rx="10" ry="13" fill="#333355" stroke="#444466" strokeWidth="1" />
        <Ellipse cx="30" cy="48" rx="7" ry="10" fill="url(#neonCyan)" opacity={0.3} />
        <Circle cx="30" cy="48" r="4" fill={isDrop ? '#FF6B9D' : '#00F5FF'} opacity={isBeat ? 0.8 : 0.4} />
        {/* Right cup */}
        <Ellipse cx="90" cy="48" rx="10" ry="13" fill="#333355" stroke="#444466" strokeWidth="1" />
        <Ellipse cx="90" cy="48" rx="7" ry="10" fill="url(#neonPink)" opacity={0.3} />
        <Circle cx="90" cy="48" r="4" fill="#FF6B9D" opacity={isBeat ? 0.8 : 0.4} />
      </G>

      {/* Body */}
      <Rect x="42" y="72" width="36" height="24" rx="8" fill="url(#robotBody)" stroke="#3D3D6E" strokeWidth="1" />

      {/* Speaker on chest */}
      <Circle cx="60" cy="84" r="8" fill="#0A0A1A" />
      <Circle cx="60" cy="84" r="6" fill="none" stroke={isDrop ? '#FF6B9D' : '#00F5FF'} strokeWidth="1" opacity={0.5} />
      <Circle cx="60" cy="84" r="3" fill="none" stroke={isDrop ? '#FF6B9D' : '#00F5FF'} strokeWidth="1" opacity={0.7} />
      <Circle cx="60" cy="84" r="1.5" fill={isDrop ? '#FF6B9D' : '#00F5FF'} opacity={isBeat ? 1 : 0.5} />

      {/* Arms */}
      <Path d="M42 78 L30 85 L28 82" stroke="#2D2D5E" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Path d="M78 78 L90 85 L92 82" stroke="#2D2D5E" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Hands */}
      <Circle cx="27" cy="81" r="4" fill="#3D3D6E" />
      <Circle cx="93" cy="81" r="4" fill="#3D3D6E" />

      {/* Legs */}
      <Rect x="48" y="96" width="8" height="10" rx="3" fill="#2D2D5E" />
      <Rect x="64" y="96" width="8" height="10" rx="3" fill="#2D2D5E" />
      {/* Feet */}
      <Rect x="45" y="104" width="14" height="6" rx="3" fill="#3D3D6E" />
      <Rect x="61" y="104" width="14" height="6" rx="3" fill="#3D3D6E" />

      {/* Sound waves when beating */}
      {isBeat && (
        <G opacity={0.4}>
          <Path d="M18 45 Q12 50 18 55" stroke="#00F5FF" strokeWidth="2" fill="none" />
          <Path d="M12 42 Q4 50 12 58" stroke="#00F5FF" strokeWidth="1.5" fill="none" />
          <Path d="M102 45 Q108 50 102 55" stroke="#FF6B9D" strokeWidth="2" fill="none" />
          <Path d="M108 42 Q116 50 108 58" stroke="#FF6B9D" strokeWidth="1.5" fill="none" />
        </G>
      )}
    </Svg>
  );
};
