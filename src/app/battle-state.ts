import { CellPos } from './types'

export enum ObjectType {
  Monster = 1,
  Projectile,
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
}

export interface BattleUpdate {
  objects: ObjectState[]
  deletedIds: number[]
}

export class BattleState {
  private lastUpdateTimeSecs: number = 0;
  private numUpdates: number = 0;

  constructor(
    private startedTimeSecs: number | undefined,
    private events: BattleEvent[] = [],
    public name: string = '',
    public results: BattleResults | undefined = undefined,
    public live: boolean = false,
    private deletedIds: Set<number> = new Set(),
  ) { }

  processEvent(event: BattleEvent) {
    this.events.push(event);
  }

  processBattleMetadata(metadata: BattleMetadata): BattleState {
    switch (metadata.status) {
      case BattleStatus.PENDING:
        return new BattleState(undefined, [], metadata.name);
      case BattleStatus.LIVE:
        if (metadata.time === undefined) {
          console.warn(metadata);
          throw new Error('Received live BattleMetadata with no time.');
        }
        return new BattleState(
          (Date.now() / 1000) - metadata.time, this.events, metadata.name, undefined, true);
      case BattleStatus.FINISHED:
        return new BattleState(
          (Date.now() / 1000), this.events, metadata.name, undefined, false);
      default: {
        const _exhaustiveCheck: never = metadata.status;
        return _exhaustiveCheck;
      }
    }
  }

  processResults(results: BattleResults): BattleState {
    return new BattleState(undefined, this.events, this.name, results);
  }

  getState(timeSecs: number): BattleUpdate | undefined {
    if (this.startedTimeSecs === undefined) {
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
      if (event.eventType === EventType.DELETE) {
        if (event.startTime > relLastUpdateTimeSecs && this.numUpdates > 0) {
          newlyDeletedIds.push(event.id);
          this.deletedIds.add(event.id);
          if (inPast) {
            numPastEvents++;
          }
        }
      } else if(event.eventType === EventType.MOVE) {
        if (event.endTime < relTimeSecs || this.deletedIds.has(event.id)) {
          if (inPast) {
            numPastEvents++;
          }
          continue;
        }

        inPast = false;
        const fracTravelled = (relTimeSecs - event.startTime) / (event.endTime - event.startTime);
        const pos = event.startPos.interpolate(event.destPos, fracTravelled);
        const newObj: ObjectState = {
          objType: event.objType,
          configId: event.configId,
          id: event.id,
          pos: pos,
        };
        objects.push(newObj);
      }
    }

    while (numPastEvents--) {
      this.events.shift();
    }

    this.numUpdates++;

    // Remove any objects that were deleted.
    let nonDeletedObjects = objects.filter(obj => !this.deletedIds.has(obj.id));

    return {
      objects: nonDeletedObjects,
      deletedIds: newlyDeletedIds,
    }
  }
}
