import { Enemy } from "../types/enemy";
import { CONFIG } from "../constants/config";
import { distance } from "../utils/math";

export class CollisionDetector {
  /**
   * Find the closest alive enemy within tap range.
   * If multiple enemies in range, pick the one closest to center (most urgent).
   */
  static findTarget(
    tapX: number,
    tapY: number,
    enemies: Enemy[]
  ): Enemy | null {
    let closestEnemy: Enemy | null = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      const dist = distance(tapX, tapY, enemy.position.x, enemy.position.y);
      const hitRange = enemy.hitRadius + CONFIG.TAP_MARGIN;
      if (dist <= hitRange && dist < closestDist) {
        closestDist = dist;
        closestEnemy = enemy;
      }
    }

    return closestEnemy;
  }

  /**
   * Check if enemy has reached center
   */
  static isAtCenter(enemy: Enemy): boolean {
    const dist = Math.sqrt(
      enemy.position.x ** 2 + enemy.position.y ** 2
    );
    return dist <= enemy.hitRadius;
  }
}
