import { CellPos } from './types'

export enum ObjectType {
  Monster = 1,
  Projectile,
}

export interface MoveEvent {
  eventType: 'move'
  objType: ObjectType
  id: number
  configId: number
  startPos: CellPos
  destPos: CellPos
  startTime: number
  endTime: number
}

export interface DeleteEvent {
  eventType: 'delete'
  objType: ObjectType
  id: number
  startTime: number
}

export type BattleEvent = MoveEvent | DeleteEvent

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
  ) { }

  processEvent(event: BattleEvent) {
    this.events.push(event);
  }

  setServerTime(timeSecs: number): BattleState {
    if (timeSecs < 0) {
      return new BattleState(undefined);
    } else {
      return new BattleState((Date.now() / 1000) - timeSecs, this.events);
    }
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
    let deletedIds: number[] = [];
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
      if (event.eventType === 'delete') {
        if (event.startTime > relLastUpdateTimeSecs && this.numUpdates > 0) {
          deletedIds.push(event.id);
          if (inPast) {
            numPastEvents++;
          }
        }
      } else if(event.eventType === 'move') {
        if (event.endTime < relTimeSecs) {
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

    return {
      objects: objects,
      deletedIds: deletedIds,
    }
  }
}
