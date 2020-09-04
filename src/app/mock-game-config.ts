import { GameConfig, GameConfigData, PlayfieldConfig, TowerConfig, MiscConfig  } from './game-config';

const playfieldConfig: PlayfieldConfig = {
  numRows: 3,
  numCols: 4,
  monsterEnter: { row: 0, col: 0 },
  monsterExit: { row: 0, col: 3 },
};

const miscConfig: MiscConfig = {
  sellMultiplier: 0.5,
};

export const mockTowerConfig0: TowerConfig = {
  id: 0,
  url: 'fake-tower-url',
  name: 'Mock Tower 0',
  cost: 10,
  firingRate: 2,
  damage: 3,
  range: 4,
};
export const mockTowerConfigWithImg0 =
  {...mockTowerConfig0, img: new Image()};
export const mockTowerConfig1: TowerConfig = {
  id: 1,
  url: 'fake-tower-url',
  name: 'Mock Tower 1',
  cost: 5,
  firingRate: 5,
  damage: 6,
  range: 7,
};
export const mockTowerConfigWithImg1 =
  {...mockTowerConfig1, img: new Image()};

let towersMap = new Map();
towersMap.set(0, mockTowerConfigWithImg0);
towersMap.set(1, mockTowerConfigWithImg1);

export const mockGameConfigData: GameConfigData = {
  playfield: playfieldConfig,
  tiles: [],
  towers: [ mockTowerConfig0, mockTowerConfig1 ],
  monsters: [],
  misc: miscConfig,
};

export const mockGameConfig =
  new GameConfig(playfieldConfig, new Map(), towersMap, new Map(), miscConfig);

