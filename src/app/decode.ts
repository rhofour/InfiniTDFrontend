import { JsonDecoder } from 'ts.data.json';

import { User, UsersContainer } from './user';
import { CellPos, TileConfig, PlayfieldConfig, MonsterConfig, TowerConfig, GameConfig } from './game-config';

export const user = JsonDecoder.object<User>(
  {
    name: JsonDecoder.string,
    accumulatedGold: JsonDecoder.number,
    gold: JsonDecoder.number,
    goldPerMinute: JsonDecoder.number,
    active: JsonDecoder.boolean,
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

export const gameConfig = JsonDecoder.object<GameConfig>(
  {
    tiles: JsonDecoder.array<TileConfig>(tileConfig, 'TileConfig[]'),
    playfield: playfieldConfig,
    monsters: JsonDecoder.array<MonsterConfig>(monsterConfig, 'MonsterConfig[]'),
    towers: JsonDecoder.array<TowerConfig>(towerConfig, 'TowerConfig[]'),
  },
  'GameConfig');
