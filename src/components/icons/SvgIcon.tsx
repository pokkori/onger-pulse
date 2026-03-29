import React from 'react';
import Svg, { Circle, Path, Rect, G, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

/** Heart/life icon (replaces heart emoji) */
export function HeartIcon({ size = 20, color = '#FF4444' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="ライフ">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
      />
    </Svg>
  );
}

/** Pause icon (replaces pause emoji) */
export function PauseIcon({ size = 20, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="一時停止">
      <Rect x="6" y="4" width="4" height="16" rx="1" fill={color} />
      <Rect x="14" y="4" width="4" height="16" rx="1" fill={color} />
    </Svg>
  );
}

/** Star icon (replaces star emoji) */
export function StarIcon({ size = 14, color = '#FFD700' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="スター">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={color}
      />
    </Svg>
  );
}

/** Sparkle icon (replaces sparkle/twinkle emoji) */
export function SparkleIcon({ size = 28, color = '#FFD700' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="キラキラ">
      <Path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={color}
      />
      <Path
        d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25L19 14Z"
        fill={color}
        opacity="0.7"
      />
      <Path
        d="M5 2L5.5 3.5L7 4L5.5 4.5L5 6L4.5 4.5L3 4L4.5 3.5L5 2Z"
        fill={color}
        opacity="0.5"
      />
    </Svg>
  );
}

/** Play/resume icon */
export function PlayIcon({ size = 20, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="再生">
      <Path d="M8 5v14l11-7z" fill={color} />
    </Svg>
  );
}
