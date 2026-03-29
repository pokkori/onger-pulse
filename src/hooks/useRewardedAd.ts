import { useState } from 'react';

/**
 * useRewardedAd -- リワード広告フック（モック実装）
 */
export function useRewardedAd() {
  const [isLoaded] = useState(true);

  const showAd = async (onReward: () => void) => {
    onReward();
  };

  return { isLoaded, showAd };
}
