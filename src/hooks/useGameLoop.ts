import { useCallback, useRef, useEffect } from "react";

/**
 * requestAnimationFrame-based game loop hook.
 * Calls `onTick(deltaMs)` every frame while active.
 */
export function useGameLoop(
  onTick: (deltaMs: number) => void,
  active: boolean
): void {
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  const loop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Cap delta to prevent huge jumps (e.g. tab switch)
    const cappedDelta = Math.min(delta, 50);
    tickRef.current(cappedDelta);

    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (active) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active, loop]);
}
