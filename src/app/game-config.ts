import { CellPos } from './types';

export interface TileConfig {
  id: number,
  url: string,
}

export interface PlayfieldConfig {
  numRows: number,
  numCols: number,
  monsterEnter: CellPos,
  monsterExit: CellPos,
  backgroundId: number,
  pathId: number,
  pathStartId: number,
  pathEndId: number,
  tileSize: number,
}

export interface MonsterConfig {
  id: number,
  url: string,
  name: string,
  health: number,
  speed: number,
  bounty: number,
  size: number,
}

export interface TowerConfig {
  id: number,
  url: string,
  name: string,
  cost: number,
  firingRate: number,
  range: number,
  damage: number,
  projectileSpeed: number,
  projectileId: number,
}

export interface ProjectileConfig {
  id: number,
  url: string,
  size: number,
}

export enum BonusType {
  ADDITIVE = 1,
  MULTIPLICATIVE,
}

export interface BonusCondition {
  percentDefeated: number,
}

export interface BattleBonus {
  id: number,
  name: string,
  bonusType: BonusType,
  bonusAmount: number,
  conditions: BonusCondition[],
}

export interface MiscConfigData {
  sellMultiplier: number,
  battleBonuses: BattleBonus[],
}

export class MiscConfig {
  readonly sellMultiplier: number;
  readonly battleBonuses: Map<number, BattleBonus>;

  constructor(data: MiscConfigData) {
    this.sellMultiplier = data.sellMultiplier;
    this.battleBonuses = new Map();
    for (let bonus of data.battleBonuses) {
      if (this.battleBonuses.has(bonus.id)) {
        console.warn(`Received a duplicate of bonus id ${bonus.id}:`);
        console.log(bonus);
      } else {
        this.battleBonuses.set(bonus.id, bonus);
      }
    }
  }
}

export interface GameConfigData {
  playfield: PlayfieldConfig,
  tiles: TileConfig[],
  towers: TowerConfig[],
  projectiles: ProjectileConfig[],
  monsters: MonsterConfig[],
  misc: MiscConfigData,
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
    if (map.has(elem.id)) {
      console.warn(`Received a duplicate of id ${elem.id}:`);
      console.log(elem);
    } else {
      map.set(elem.id, configImagePair);
    }
  }
  return Promise.all(promises).then(() => map);
}

export class GameConfig {
  readonly playfield: PlayfieldConfig;
  readonly tiles: ConfigImageMap<TileConfig>;
  readonly towers: ConfigImageMap<TowerConfig>;
  readonly projectiles: ConfigImageMap<ProjectileConfig>;
  readonly monsters: ConfigImageMap<MonsterConfig>;
  readonly misc: MiscConfig;

  static fromConfig(configData: GameConfigData): Promise<GameConfig> {
    return Promise.all([
      configArrayToMap(configData.tiles), configArrayToMap(configData.towers),
      configArrayToMap(configData.projectiles), configArrayToMap(configData.monsters)
    ]).then(([tiles, towers, projectiles, monsters]) => {
        return new GameConfig(configData.playfield, tiles, towers, projectiles, monsters, new MiscConfig(configData.misc));
      });
  }

  constructor(playfield: PlayfieldConfig, tiles: ConfigImageMap<TileConfig>, towers: ConfigImageMap<TowerConfig>,
     projectiles: ConfigImageMap<ProjectileConfig>, monsters: ConfigImageMap<MonsterConfig>, misc: MiscConfig) {
    this.playfield = playfield;
    this.tiles = tiles;
    this.towers = towers;
    this.projectiles = projectiles;
    this.monsters = monsters;
    this.misc = misc;
  }
}
