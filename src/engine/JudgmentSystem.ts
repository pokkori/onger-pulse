import { Enemy } from "../types/enemy";
import {
  Judgment,
  JudgmentResult,
  JUDGMENT_WINDOWS,
} from "../types/judgment";
import { CollisionDetector } from "./CollisionDetector";
import { ScoreCalculator } from "./ScoreCalculator";
import { generateId } from "../utils/math";

export class JudgmentSystem {
  /**
   * Judge a tap
   * @param tapX tap X (center-relative)
   * @param tapY tap Y (center-relative)
   * @param elapsedMs current song elapsed time
   * @param enemies alive enemies list
   * @param combo current combo
   * @returns JudgmentResult or null (whiff)
   */
  static judge(
    tapX: number,
    tapY: number,
    elapsedMs: number,
    enemies: Enemy[],
    combo: number
  ): JudgmentResult | null {
    const target = CollisionDetector.findTarget(tapX, tapY, enemies);
    if (!target) return null;

    // Timing: difference between current time and expected arrival
    const offsetMs = elapsedMs - target.spawnTimeMs;
    const absOffset = Math.abs(offsetMs);

    let judgment: Judgment;
    if (absOffset <= JUDGMENT_WINDOWS.perfect) {
      judgment = "perfect";
    } else if (absOffset <= JUDGMENT_WINDOWS.great) {
      judgment = "great";
    } else if (absOffset <= JUDGMENT_WINDOWS.good) {
      judgment = "good";
    } else {
      judgment = "miss";
    }

    const score = ScoreCalculator.calculate(
      target.baseScore,
      judgment,
      combo
    );

    return {
      judgment,
      offsetMs,
      enemyId: target.id,
      score,
      tapPosition: { x: tapX, y: tapY },
      timestamp: Date.now(),
    };
  }

  /**
   * Create split children when a split enemy is destroyed
   */
  static createSplitChildren(parent: Enemy): Enemy[] {
    const children: Enemy[] = [];
    const angles = [Math.PI / 4, -Math.PI / 4];

    for (const angleOffset of angles) {
      const baseAngle = Math.atan2(parent.position.y, parent.position.x);
      const newAngle = baseAngle + angleOffset;
      const spawnDist = 100;

      children.push({
        id: generateId(),
        type: "normal",
        hp: 1,
        maxHp: 1,
        speed: 1.5,
        direction: parent.direction,
        spawnTimeMs: Date.now(),
        position: {
          x: parent.position.x + Math.cos(newAngle) * spawnDist,
          y: parent.position.y + Math.sin(newAngle) * spawnDist,
        },
        hitRadius: 30,
        alive: true,
        timeToCenter: 800,
        baseScore: 50,
      });
    }

    return children;
  }
}
