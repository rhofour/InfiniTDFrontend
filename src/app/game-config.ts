export interface CellPos { row: number, col: number }

export interface TileConfig {
  id: number,
  url: string,
}

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
  url: string,
  name: string,
  cost: number,
  firingRate: number,
  range: number,
  damage: number,
}

export interface GameConfig {
  tiles: TileConfig[],
  playfield: PlayfieldConfig,
  monsters: MonsterConfig[],
  towers: TowerConfig[],
}

const emptyPlayfieldConfig: PlayfieldConfig = {
  numRows: 0,
  numCols: 0,
  monsterEnter: { row: 0, col: 0 },
  monsterExit: { row: 0, col: 0 },
};

export const emptyGameConfig: GameConfig = {
  tiles: [],
  playfield: emptyPlayfieldConfig,
  monsters: [],
  towers: [],
};
