import { Enemy, ENEMY_PARAMS } from "../types/enemy";
import { BeatMap, BeatNote } from "../types/beatmap";
import { Direction } from "../types/enemy";
import { SCREEN_WIDTH, SCREEN_HEIGHT, SPAWN_MARGIN } from "../constants/layout";
import { generateId } from "../utils/math";

export class EnemySpawner {
  private beatMap: BeatMap;
  private nextNoteIndex: number = 0;

  constructor(beatMap: BeatMap) {
    this.beatMap = beatMap;
  }

  reset(): void {
    this.nextNoteIndex = 0;
  }

  checkSpawns(elapsedMs: number): Enemy[] {
    const spawned: Enemy[] = [];

    while (this.nextNoteIndex < this.beatMap.notes.length) {
      const note = this.beatMap.notes[this.nextNoteIndex];
      const spawnTime = note.timeMs - note.travelTimeMs;

      if (elapsedMs >= spawnTime) {
        spawned.push(this.createEnemy(note));
        this.nextNoteIndex++;
      } else {
        break;
      }
    }

    return spawned;
  }

  private createEnemy(note: BeatNote): Enemy {
    const params = ENEMY_PARAMS[note.enemyType];
    const spawnPos = EnemySpawner.getSpawnPosition(note.direction);

    return {
      id: generateId(),
      type: note.enemyType,
      hp: params.hp,
      maxHp: params.hp,
      speed: params.speed,
      direction: note.direction,
      spawnTimeMs: note.timeMs,
      position: spawnPos,
      hitRadius: params.hitRadius,
      alive: true,
      timeToCenter: note.travelTimeMs,
      baseScore: params.baseScore,
    };
  }

  static getSpawnPosition(direction: Direction): { x: number; y: number } {
    const hw = SCREEN_WIDTH / 2 + SPAWN_MARGIN;
    const hh = SCREEN_HEIGHT / 2 + SPAWN_MARGIN;
    const POSITIONS: Record<Direction, { x: number; y: number }> = {
      N: { x: 0, y: -hh },
      NE: { x: hw, y: -hh },
      E: { x: hw, y: 0 },
      SE: { x: hw, y: hh },
      S: { x: 0, y: hh },
      SW: { x: -hw, y: hh },
      W: { x: -hw, y: 0 },
      NW: { x: -hw, y: -hh },
    };
    return { ...POSITIONS[direction] };
  }
}
