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

export interface MiscConfig {
  sellMultiplier: number,
}

export interface GameConfigData {
  playfield: PlayfieldConfig,
  tiles: TileConfig[],
  towers: TowerConfig[],
  monsters: MonsterConfig[],
  misc: MiscConfig,
}

export type ConfigAndImage<T> = T & { img: HTMLImageElement };

export type ConfigImageMap<T> = Map<number, ConfigAndImage<T>>;

function configArrayToMap<T extends {id: number, url: string}>(arr: T[]): Promise<ConfigImageMap<T>> {
  let map = new Map();
  let promises: Promise<void>[] = [];
  for (let elem of arr) {
    let configImagePair = {
      ...elem,
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

export class GameConfig {
  readonly playfield: PlayfieldConfig;
  readonly tiles: ConfigImageMap<TileConfig>;
  readonly towers: ConfigImageMap<TowerConfig>;
  readonly monsters: ConfigImageMap<MonsterConfig>;
  readonly misc: MiscConfig;

  static fromConfig(configData: GameConfigData): Promise<GameConfig> {
    return Promise.all([configArrayToMap(configData.tiles), configArrayToMap(configData.towers), configArrayToMap(configData.monsters)]).
      then(([tiles, towers, monsters]) => {
        return new GameConfig(configData.playfield, tiles, towers, monsters, configData.misc);
      });
  }

  constructor(playfield: PlayfieldConfig, tiles: ConfigImageMap<TileConfig>, towers: ConfigImageMap<TowerConfig>,
     monsters: ConfigImageMap<MonsterConfig>, misc: MiscConfig) {
    this.playfield = playfield;
    this.tiles = tiles;
    this.towers = towers;
    this.monsters = monsters;
    this.misc = misc;
  }
}
