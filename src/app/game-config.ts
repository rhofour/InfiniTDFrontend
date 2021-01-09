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
  projectileUrl: string,
  projectileSize: number,
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
  monsters: MonsterConfig[],
  misc: MiscConfigData,
}

function configArrayToMap<T extends {id: number}>(arr: T[]): Map<number, T> {
  let map = new Map();
  for (let elem of arr) {
    if (map.has(elem.id)) {
      console.warn(`Received a duplicate of id ${elem.id}:`);
      console.log(elem);
    } else {
      map.set(elem.id, elem);
    }
  }
  return map;
}

export interface ConfigImageMaps {
  tiles: Map<number, HTMLImageElement>;
  towers: Map<number, HTMLImageElement>;
  projectiles: Map<number, HTMLImageElement>;
  monsters: Map<number, HTMLImageElement>;
}

function mapToImageMap<T extends {[P in K]: string}, K extends keyof T>(
    map: Map<number, T>, urlKey: K): Promise<Map<number, HTMLImageElement>> {
  let imageMap = new Map();
  let promises: Promise<void>[] = [];
  for (let [id, elem] of map) {
    let img = new Image();
    const loadPromise: Promise<void> = new Promise((resolve, reject) => {
      img.onload = () => resolve();
    });
    img.src = elem[urlKey];
    promises.push(loadPromise);
    imageMap.set(id, img);
  }
  return Promise.all(promises).then(() => imageMap);
}

export class GameConfig {
  readonly playfield: PlayfieldConfig;
  readonly tiles: Map<number, TileConfig>;
  readonly towers: Map<number, TowerConfig>;
  readonly monsters: Map<number, MonsterConfig>;
  readonly misc: MiscConfig;
  readonly images: ConfigImageMaps;

  static fromConfig(configData: GameConfigData): Promise<GameConfig> {
    const tilesMap = configArrayToMap(configData.tiles);
    const towersMap = configArrayToMap(configData.towers);
    const monstersMap = configArrayToMap(configData.monsters);
    return Promise.all([
      mapToImageMap(tilesMap, "url"),
      mapToImageMap(towersMap, "url"),
      mapToImageMap(towersMap, "projectileUrl"),
      mapToImageMap(monstersMap, "url"),
    ]).then(([tileImgs, towerImgs, projectileImgs, monsterImgs]) => {
        return new GameConfig(
          configData.playfield, tilesMap, towersMap, monstersMap, new MiscConfig(configData.misc),
          {
            tiles: tileImgs,
            towers: towerImgs,
            projectiles: projectileImgs,
            monsters: monsterImgs,
          });
      });
  }

  constructor(playfield: PlayfieldConfig, tiles: Map<number, TileConfig>, towers: Map<number, TowerConfig>,
     monsters: Map<number, MonsterConfig>, misc: MiscConfig, images: ConfigImageMaps) {
    this.playfield = playfield;
    this.tiles = tiles;
    this.towers = towers;
    this.monsters = monsters;
    this.misc = misc;
    this.images = images;
  }
}
