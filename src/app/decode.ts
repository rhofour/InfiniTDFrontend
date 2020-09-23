import { JsonDecoder } from 'ts.data.json';

import { CellPos, CellPosData } from './types';
import { User, UsersContainer } from './user';
import { TileConfig, PlayfieldConfig, MonsterConfig, TowerConfig, GameConfigData, MiscConfig } from './game-config';
import { TowerBgState, TowersBgState, BattlegroundState } from './battleground-state';
import { ObjectType, MoveEvent, DeleteEvent, BattleEvent } from './battle-state';

export const user = JsonDecoder.object<User>(
  {
    name: JsonDecoder.string,
    accumulatedGold: JsonDecoder.number,
    gold: JsonDecoder.number,
    goldPerMinute: JsonDecoder.number,
    inBattle: JsonDecoder.boolean,
    wave: JsonDecoder.array<number>(JsonDecoder.number, 'number[]'),
  },
  'User');

export const usersContainer = JsonDecoder.object<UsersContainer>(
  {
    users: JsonDecoder.array<User>(user, 'User[]')
  },
  'UserContainer');

export const cellPosData = JsonDecoder.object<CellPosData>(
  {
    row: JsonDecoder.number,
    col: JsonDecoder.number,
  },
  'CellPosData');

export const cellPos = cellPosData.map<CellPos>(
  (data: CellPosData) => new CellPos(data.row, data.col));

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
    backgroundId: JsonDecoder.number,
    pathId: JsonDecoder.number,
    pathStartId: JsonDecoder.number,
    pathEndId: JsonDecoder.number,
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

export const objectType = JsonDecoder.enumeration<ObjectType>(ObjectType, 'ObjectType')

export const moveEvent = JsonDecoder.object<MoveEvent>(
  {
    objType: objectType,
    id: JsonDecoder.number,
    configId: JsonDecoder.number,
    startPos: cellPos,
    endPos: cellPos,
    startTime: JsonDecoder.number,
    endTime: JsonDecoder.number,
  },
  'MoveEvent');

export const deleteEvent = JsonDecoder.object<DeleteEvent>(
  {
    objType: objectType,
    id: JsonDecoder.number,
    startTime: JsonDecoder.number,
  },
  'DeleteEvent');

export const battleEvent = JsonDecoder.oneOf<BattleEvent>(
  [moveEvent, deleteEvent], 'BattleEvent');
