import { JsonDecoder } from 'ts.data.json';

import { User, UsersContainer } from './user';
import { CellPos, TileConfig, PlayfieldConfig, MonsterConfig, TowerConfig, GameConfigData, MiscConfig } from './game-config';
import { TowerBgState, TowersBgState, BattlegroundState } from './battleground-state';

export const user = JsonDecoder.object<User>(
  {
    name: JsonDecoder.string,
    accumulatedGold: JsonDecoder.number,
    gold: JsonDecoder.number,
    goldPerMinute: JsonDecoder.number,
    inBattle: JsonDecoder.boolean,
  },
  'User');

export const usersContainer = JsonDecoder.object<UsersContainer>(
  {
    users: JsonDecoder.array<User>(user, 'User[]')
  },
  'UserContainer');

export const cellPos = JsonDecoder.object<CellPos>(
  {
    row: JsonDecoder.number,
    col: JsonDecoder.number,
  },
  'CellPos');

export const tileConfig = JsonDecoder.object<TileConfig>(
  {
    id: JsonDecoder.number,
    url: JsonDecoder.string,
  },
  'TileConfig');

export const playfieldConfig = JsonDecoder.object<PlayfieldConfig>(
  {
    numRows: JsonDecoder.number,
    numCols: JsonDecoder.number,
    monsterEnter: cellPos,
    monsterExit: cellPos,
  },
  'PlayfieldConfig');

export const monsterConfig = JsonDecoder.object<MonsterConfig>(
  {
    id: JsonDecoder.number,
    url: JsonDecoder.string,
    name: JsonDecoder.string,
    health: JsonDecoder.number,
    speed: JsonDecoder.number,
    bounty: JsonDecoder.number,
  },
  'MonsterConfig');

export const towerConfig = JsonDecoder.object<TowerConfig>(
  {
    id: JsonDecoder.number,
    url: JsonDecoder.string,
    name: JsonDecoder.string,
    cost: JsonDecoder.number,
    firingRate: JsonDecoder.number,
    range: JsonDecoder.number,
    damage: JsonDecoder.number,
  },
  'TowerConfig');

export const miscConfig = JsonDecoder.object<MiscConfig>(
  {
    sellMultiplier: JsonDecoder.number,
  },
  'MiscConfig');

export const gameConfigData = JsonDecoder.object<GameConfigData>(
  {
    tiles: JsonDecoder.array<TileConfig>(tileConfig, 'TileConfig[]'),
    playfield: playfieldConfig,
    monsters: JsonDecoder.array<MonsterConfig>(monsterConfig, 'MonsterConfig[]'),
    towers: JsonDecoder.array<TowerConfig>(towerConfig, 'TowerConfig[]'),
    misc: miscConfig,
  },
  'GameConfigData');

export const towerBgState = JsonDecoder.object<TowerBgState>(
  {
    id: JsonDecoder.number,
  },
  'TowerBgState');

export const towersBgState = JsonDecoder.object<TowersBgState>(
  {
    towers: JsonDecoder.array<(TowerBgState | undefined)[]>(
      JsonDecoder.array<TowerBgState | undefined>(
        JsonDecoder.optional(towerBgState), '(TowerBgState | undefined)[]'),
        '(TowerBgState | undefined)[][]'),
  },
  'TowersBgState');

export const battlegroundState = JsonDecoder.object<BattlegroundState>(
  {
    towers: towersBgState,
  },
  'BattlegroundState');
