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
  url: string,
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
  playfield: PlayfieldConfig,
  tiles: TileConfig[],
  towers: TowerConfig[],
  monsters: MonsterConfig[],
}

export interface ConfigImagePair<T> {
  config: T;
  img: HTMLImageElement;
}

export type ConfigImageMap<T> = Map<number, ConfigImagePair<T>>;

function configArrayToMap<T extends {id: number, url: string}>(arr: T[]): Promise<ConfigImageMap<T>> {
  let map = new Map();
  let promises: Promise<void>[] = [];
  for (let elem of arr) {
    let configImagePair = {
      config: elem,
      img: new Image(),
    }
    let loadPromise: Promise<void> = new Promise((resolve, reject) => {
      configImagePair.img.onload = () => resolve();
    });
    configImagePair.img.src = elem.url;
    promises.push(loadPromise);
    map.set(elem.id, configImagePair);
  }
  return Promise.all(promises).then(() => map);
}

export class GameConfigClass {
  // Replace these Maps with MapWithImage
  readonly playfield: PlayfieldConfig;
  readonly tiles: ConfigImageMap<TileConfig>;
  readonly towers: ConfigImageMap<TowerConfig>;
  readonly monsters: ConfigImageMap<MonsterConfig>;

  static fromConfig(configData: GameConfig): Promise<GameConfigClass> {
    return Promise.all([configArrayToMap(configData.tiles), configArrayToMap(configData.towers),
      configArrayToMap(configData.monsters)]).then(([tiles, towers, monsters]) => {
        return new GameConfigClass(configData.playfield, tiles, towers, monsters);
      });
  }

  static makeEmpty(): GameConfigClass {
    return new GameConfigClass(emptyPlayfieldConfig, new Map(), new Map(), new Map());
  }

  constructor(playfield: PlayfieldConfig, tiles: ConfigImageMap<TileConfig>, towers: ConfigImageMap<TowerConfig>,
     monsters: ConfigImageMap<MonsterConfig>) {
    this.playfield = playfield;
    this.tiles = tiles;
    this.towers = towers;
    this.monsters = monsters;
  }
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
