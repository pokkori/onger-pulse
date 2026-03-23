import { useCallback } from "react";
import { AudioEngine } from "../audio/AudioEngine";

export function useAudio() {
  const init = useCallback(async () => {
    await AudioEngine.getInstance().init();
  }, []);

  const cleanup = useCallback(async () => {
    await AudioEngine.getInstance().cleanup();
  }, []);

  return { init, cleanup };
}
