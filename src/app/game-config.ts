export interface CellPos { row: number, col: number }

export interface PlayfieldConfig {
  numRows: number,
  numCols: number,
  monsterEnter: CellPos,
  monsterExit: CellPos,
}

export interface MonsterConfig {
  id: number,
  name: string,
  health: number,
  speed: number,
  bounty: number,
}

export interface TowerConfig {
  id: number,
  name: string,
  cost: number,
  firingRate: number,
  range: number,
  damage: number,
}

export interface GameConfig {
  playfield: PlayfieldConfig,
  monsters: MonsterConfig[],
  towers: TowerConfig[],
}
