import { useRef, useCallback } from "react";
import { BeatClock } from "../audio/BeatClock";

export function useBeatClock(bpm: number) {
  const clockRef = useRef(new BeatClock(bpm));

  const advance = useCallback((deltaMs: number) => {
    clockRef.current.advance(deltaMs);
  }, []);

  const reset = useCallback(() => {
    clockRef.current.reset();
  }, []);

  return {
    clock: clockRef.current,
    advance,
    reset,
  };
}
