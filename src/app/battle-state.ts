import { CellPos } from './types'

export enum ObjectType {
  Monster,
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

  constructor(
    private startedTimeSecs: number | undefined,
    private events: BattleEvent[] = [],
  ) { }

  processEvent(event: BattleEvent) {
    console.log(event);
    this.events.push(event);
  }

  setServerTime(timeSecs: number): BattleState {
    console.log(`BattleState time: ${timeSecs}`);
    if (timeSecs < 0) {
      return new BattleState(undefined);
    } else {
      return new BattleState(Date.now() - timeSecs * 1000, this.events);
    }
  }

  getState(timeSecs: number): BattleUpdate | undefined {
    if (this.startedTimeSecs === undefined) {
      return undefined;
    }
    this.lastUpdateTimeSecs = timeSecs;

    let numPastEvents = 0;
    for (let i = 0; i < this.events.length; i++) {
      const event: BattleEvent = this.events[i];
    }
    while (numPastEvents--) {
      this.events.shift();
    }

    return {
      objects: [],
      deletedIds: [],
    }
  }
}
