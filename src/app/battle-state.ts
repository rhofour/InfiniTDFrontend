import { CellPos } from 'types'

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

export interface BattleState {
  events: BattleEvent[]
}
