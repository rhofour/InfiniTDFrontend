import { GameConfig, GameConfigData, PlayfieldConfig  } from './game-config';

const playfieldConfig: PlayfieldConfig = {
  numRows: 3,
  numCols: 4,
  monsterEnter: { row: 0, col: 0 },
  monsterExit: { row: 0, col: 3 },
};

export const mockGameConfig = new GameConfig(
  playfieldConfig, new Map(), new Map(), new Map()
);

export const mockGameConfigData: GameConfigData = {
  playfield: playfieldConfig,
  tiles: [],
  towers: [],
  monsters: [],
}
