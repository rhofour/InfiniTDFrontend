import { CellPos } from './types'
import { GameConfig, MonsterConfig } from './game-config';

export enum ObjectType {
  MONSTER = 1,
  PROJECTILE,
}

export enum EventType {
  MOVE = 1,
  DELETE,
  DAMAGE
}

export interface MoveEvent {
  eventType: EventType.MOVE
  objType: ObjectType
  id: number
  configId: number
  startPos: CellPos
  destPos: CellPos
  startTime: number
  endTime: number
}

export interface DeleteEvent {
  eventType: EventType.DELETE
  objType: ObjectType
  id: number
  startTime: number
}

export interface DamageEvent {
  eventType: EventType.DAMAGE
  id: number
  startTime: number
  health: number
}

export type BattleEvent = MoveEvent | DeleteEvent | DamageEvent

export enum BattleStatus {
  PENDING = 1,
  FINISHED,
  LIVE,
}

export interface BattleMetadata {
  status: BattleStatus
  name: string
  time?: number
}

export interface BattleResults {
  monstersDefeated: Map<number, [number, number]>
  bonuses: number[]
  reward: number
  timeSecs: number
}

export interface Battle {
  name: string
  events: BattleEvent[]
  results: BattleResults
}

export interface ObjectState {
  objType: ObjectType
  configId: number
  id: number
  pos: CellPos
  health?: number
  maxHealth?: number
}

export interface BattleUpdate {
  objects: ObjectState[]
  deletedIds: number[]
}

export class BattleState {
  private lastUpdateTimeSecs: number = 0;
  private numUpdates: number = 0;

  constructor(
    public name: string,
    private startedTimeSecs: number | undefined = undefined,
    private events: BattleEvent[] = [],
    public live: boolean = false,
    public results: BattleResults | undefined = undefined,
  ) { }

  processEvent(event: BattleEvent) {
    this.events.push(event);
  }

  processBattleMetadata(metadata: BattleMetadata): BattleState {
    switch (metadata.status) {
      case BattleStatus.PENDING:
        return new BattleState(metadata.name);
      case BattleStatus.LIVE:
        if (metadata.time === undefined) {
          console.warn(metadata);
          throw new Error('Received live BattleMetadata with no time.');
        }
        return new BattleState(
          metadata.name, (Date.now() / 1000) - metadata.time, this.events, true);
      case BattleStatus.FINISHED:
        return new BattleState(
          metadata.name, (Date.now() / 1000), this.events, false);
      default: {
        const _exhaustiveCheck: never = metadata.status;
        return _exhaustiveCheck;
      }
    }
  }

  processResults(results: BattleResults): BattleState {
    return new BattleState(
      this.name, this.startedTimeSecs, this.events, false, results);
  }

  getState(timeSecs: number, gameConfig: GameConfig): BattleUpdate | undefined {
    if (this.startedTimeSecs === undefined) {
      return undefined;
    }
    if (this.events.length === 0) {
      return undefined;
    }
    // Convert to times relative to the start of the battle.
    const relTimeSecs = timeSecs - this.startedTimeSecs;
    const relLastUpdateTimeSecs = this.lastUpdateTimeSecs - this.startedTimeSecs;
    this.lastUpdateTimeSecs = timeSecs;

    let numPastEvents = 0;
    let newlyDeletedIds: number[] = [];
    let objects: ObjectState[] = [];
    let inPast: boolean = true;
    let lastStartTime = 0;
    for (let i = 0; i < this.events.length; i++) {
      const event: BattleEvent = this.events[i];
      if (event.startTime < lastStartTime) {
        console.warn(`Events out of order. Received ${lastStartTime} then ${event.startTime}`);
        console.log(this.events);
        return undefined;
      }
      lastStartTime = event.startTime;
      if (event.startTime > relTimeSecs) {
        break; // Stop when we're caught up.
      }
      switch (event.eventType) {
        case EventType.DELETE: {
          if (event.startTime > relLastUpdateTimeSecs) {
            if (this.numUpdates > 0) {
              // Don't mark an enemy as deleted if the UI has and will never
              // see them.
              newlyDeletedIds.push(event.id);
            }
            if (inPast) {
              numPastEvents++;
            }
          }
          break;
        }
        case EventType.MOVE: {
          if (event.endTime < relTimeSecs || newlyDeletedIds.includes(event.id)) {
            if (inPast) {
              numPastEvents++;
            }
            continue;
          }

          inPast = false;
          const fracTravelled = (relTimeSecs - event.startTime) / (event.endTime - event.startTime);
          const pos = event.startPos.interpolate(event.destPos, fracTravelled);
          switch (event.objType) {
            case ObjectType.MONSTER: {
              const monsterConfig = gameConfig.monsters.get(event.configId);
              if (monsterConfig === undefined) {
                throw Error(`Could not find config for monster ID ${event.configId}.`);
              }
              const newObj: ObjectState = {
                objType: event.objType,
                configId: event.configId,
                id: event.id,
                pos: pos,
                health: monsterConfig.health,
                maxHealth: monsterConfig.health,
              };
              objects.push(newObj);
              break;
            }
            case ObjectType.PROJECTILE: {
              const newObj: ObjectState = {
                objType: event.objType,
                configId: event.configId,
                id: event.id,
                pos: pos,
              };
              objects.push(newObj);
              break;
            }
            default:
              const _exhaustiveCheck: never = event.objType;
          }
          break;
        }
        case EventType.DAMAGE: {
          for (let obj of objects) {
            if (obj.id === event.id) {
              obj.health = event.health;
            }
          }
          break;
        }
        default:
          const _exhaustiveCheck: never = event;
      }
    }

    while (numPastEvents--) {
      this.events.shift();
    }

    this.numUpdates++;

    // Remove any objects that were deleted.
    let nonDeletedObjects = objects.filter(obj => !newlyDeletedIds.includes(obj.id));

    // Remove any events that reference deleted objects.
    this.events = this.events.filter(obj => !newlyDeletedIds.includes(obj.id));

    return {
      objects: nonDeletedObjects,
      deletedIds: newlyDeletedIds,
    }
  }
}
