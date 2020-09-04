import { GameConfig, GameConfigData, PlayfieldConfig, TowerConfig  } from './game-config';

const playfieldConfig: PlayfieldConfig = {
  numRows: 3,
  numCols: 4,
  monsterEnter: { row: 0, col: 0 },
  monsterExit: { row: 0, col: 3 },
};

export const mockTowerConfig: TowerConfig = {
  id: 0,
  url: 'fake-tower-url',
  name: 'Mock Tower 0',
  cost: 10,
  firingRate: 2,
  damage: 3,
  range: 4,
};
export const mockTowerConfigWithImg =
  {...mockTowerConfig, img: new Image()};

let towersMap = new Map();
towersMap.set(0, mockTowerConfigWithImg);

export const mockGameConfigData: GameConfigData = {
  playfield: playfieldConfig,
  tiles: [],
  towers: [ mockTowerConfig ],
  monsters: [],
};

export const mockGameConfig = new GameConfig(
  playfieldConfig, new Map(), towersMap, new Map()
);

