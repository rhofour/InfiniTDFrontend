import { CellPos } from './types';
import { GameConfig, GameConfigData, PlayfieldConfig, TowerConfig, MiscConfigData, MiscConfig  } from './game-config';

const playfieldConfig: PlayfieldConfig = {
  numRows: 3,
  numCols: 4,
  monsterEnter: new CellPos(0, 0),
  monsterExit: new CellPos(0, 3),
  backgroundId: 0,
  pathId: 0,
  pathStartId: 0,
  pathEndId: 0,
  tileSize: 32,
};

const miscConfigData: MiscConfigData = {
  sellMultiplier: 0.5,
  battleBonuses: [],
};

export const mockTowerConfig0: TowerConfig = {
  id: 0,
  url: 'fake-tower-url',
  name: 'Mock Tower 0',
  cost: 10,
  firingRate: 2,
  damage: 3,
  range: 4,
  projectileSpeed: 1.0,
  projectileUrl: 'fake-proj-url',
  projectileSize: 8,
  projectileRotate: true,
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
  projectileSpeed: 1.5,
  projectileUrl: 'fake-proj-url',
  projectileSize: 8,
  projectileRotate: true,
};
export const mockTowerConfigWithImg1 =
  {...mockTowerConfig1, img: new Image()};

let towersMap = new Map();
towersMap.set(0, mockTowerConfig0);
towersMap.set(1, mockTowerConfig1);

export const mockGameConfigData: GameConfigData = {
  playfield: playfieldConfig,
  tiles: [],
  towers: [ mockTowerConfig0, mockTowerConfig1 ],
  monsters: [],
  misc: miscConfigData,
};

const emptyImageMaps = {
  tiles: new Map(),
  towers: new Map(),
  projectiles: new Map(),
  monsters: new Map(),
};

export const mockGameConfig =
  new GameConfig(
    playfieldConfig,
    new Map(),
    towersMap,
    new Map(),
    new MiscConfig(miscConfigData),
    emptyImageMaps);