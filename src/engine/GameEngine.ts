import { BeatMap } from "../types/beatmap";
import { Enemy } from "../types/enemy";
import { CONFIG } from "../constants/config";
import { EnemySpawner } from "./EnemySpawner";
import { CollisionDetector } from "./CollisionDetector";
import { ComboManager } from "./ComboManager";

/**
 * Main game engine - drives the game loop.
 * Call tick() each frame via requestAnimationFrame.
 */
export class GameEngine {
  private beatMap: BeatMap;
  private spawner: EnemySpawner;
  public elapsedMs: number = 0;

  constructor(beatMap: BeatMap) {
    this.beatMap = beatMap;
    this.spawner = new EnemySpawner(beatMap);
  }

  reset(): void {
    this.elapsedMs = 0;
    this.spawner.reset();
  }

  /**
   * Advance game state by deltaMs.
   * Returns new enemies to spawn, enemies that reached center (miss), and whether song is complete.
   */
  tick(
    deltaMs: number,
    currentEnemies: Enemy[],
    combo: number
  ): {
    newEnemies: Enemy[];
    missedEnemies: Enemy[];
    updatedEnemies: Enemy[];
    songComplete: boolean;
    activeLayerCount: number;
  } {
    this.elapsedMs += deltaMs;

    // 1. Spawn new enemies
    const newEnemies = this.spawner.checkSpawns(this.elapsedMs);

    // 2. Move existing enemies toward center
    const updatedEnemies: Enemy[] = [];
    const missedEnemies: Enemy[] = [];

    for (const enemy of currentEnemies) {
      if (!enemy.alive) continue;

      const moved = this.moveEnemy(enemy, deltaMs);

      if (CollisionDetector.isAtCenter(moved)) {
        missedEnemies.push(moved);
      } else {
        updatedEnemies.push(moved);
      }
    }

    // 3. Layer count
    const activeLayerCount = ComboManager.getActiveLayerCount(combo);

    // 4. Song complete check
    const allNotesSpawned =
      this.elapsedMs >= this.beatMap.durationMs;
    const songComplete =
      allNotesSpawned && updatedEnemies.length === 0 && newEnemies.length === 0;

    return {
      newEnemies,
      missedEnemies,
      updatedEnemies,
      songComplete,
      activeLayerCount,
    };
  }

  private moveEnemy(enemy: Enemy, deltaMs: number): Enemy {
    const BASE_SPEED = CONFIG.BASE_ENEMY_SPEED;
    const pxPerMs = (BASE_SPEED * enemy.speed) / 1000;
    const dx = 0 - enemy.position.x;
    const dy = 0 - enemy.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 1) {
      return { ...enemy, position: { x: 0, y: 0 }, timeToCenter: 0 };
    }

    const moveAmount = pxPerMs * deltaMs;
    const ratio = Math.min(moveAmount / dist, 1);

    return {
      ...enemy,
      position: {
        x: enemy.position.x + dx * ratio,
        y: enemy.position.y + dy * ratio,
      },
      timeToCenter: dist / pxPerMs,
    };
  }

  getDurationMs(): number {
    return this.beatMap.durationMs;
  }
}
