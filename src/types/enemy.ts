/** Enemy's approach direction (8 compass points from screen edge) */
export type Direction =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW";

/** Enemy variant */
export type EnemyType =
  | "normal"
  | "fast"
  | "heavy"
  | "split"
  | "boss";

/** Enemy instance */
export interface Enemy {
  id: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  direction: Direction;
  spawnTimeMs: number;
  position: { x: number; y: number };
  hitRadius: number;
  alive: boolean;
  timeToCenter: number;
  baseScore: number;
}

/** Fixed params per enemy type */
export const ENEMY_PARAMS: Record<
  EnemyType,
  { hp: number; speed: number; hitRadius: number; baseScore: number }
> = {
  normal: { hp: 1, speed: 1.0, hitRadius: 40, baseScore: 100 },
  fast: { hp: 1, speed: 2.0, hitRadius: 30, baseScore: 150 },
  heavy: { hp: 3, speed: 0.6, hitRadius: 60, baseScore: 300 },
  split: { hp: 1, speed: 0.8, hitRadius: 35, baseScore: 200 },
  boss: { hp: 10, speed: 0.3, hitRadius: 80, baseScore: 2000 },
};
