import { CellPos } from './types'

export enum ObjectType {
  Monster,
  Projectile,
}

export interface MoveEvent {
  objType: ObjectType
  id: number
  configId: number
  startPos: CellPos
  endPos: CellPos
  startTime: number
  endTime: number
}

export interface DeleteEvent {
  objType: ObjectType
  id: number
  startTime: number
}

export type BattleEvent = MoveEvent | DeleteEvent

export interface ObjectState {
  objType: ObjectType
  id: number
  pos: CellPos
}

export interface BattleUpdate {
  objects: ObjectState[]
  deletedIds: number[]
}

export class BattleState {
  public running: boolean = false

  private lastUpdateTime: number = 0
  private events: BattleEvent[] = [];

  processEvent(event: unknown) {
    console.log(event);
  }

  setServerTime(time: number) {
    console.log(`BattleState time: ${time}`);
  }

  getState(time: number): BattleUpdate {
    this.lastUpdateTime = time;

    return {
      objects: [],
      deletedIds: [],
    }
  }
}
