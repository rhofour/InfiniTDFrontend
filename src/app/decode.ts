import { JsonDecoder, err, ok } from 'ts.data.json';

import { CellPos, CellPosData } from './types';
import { User, UsersContainer } from './user';
import { TileConfig, PlayfieldConfig, MonsterConfig, TowerConfig, GameConfigData, MiscConfig } from './game-config';
import { TowerBgState, TowersBgState, BattlegroundState } from './battleground-state';
import { ObjectType, EventType, MoveEvent, DeleteEvent, BattleEvent, StartBattle, BattleResults } from './battle-state';
import * as backend from './backend';

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

function addBackendToUrl(relUrl: string) {
  return backend.address + '/' + relUrl;
}

export const tileConfig = JsonDecoder.object<TileConfig>(
  {
    id: JsonDecoder.number,
    url: JsonDecoder.string.map<string>(addBackendToUrl),
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
    url: JsonDecoder.string.map<string>(addBackendToUrl),
    name: JsonDecoder.string,
    health: JsonDecoder.number,
    speed: JsonDecoder.number,
    bounty: JsonDecoder.number,
  },
  'MonsterConfig');

export const towerConfig = JsonDecoder.object<TowerConfig>(
  {
    id: JsonDecoder.number,
    url: JsonDecoder.string.map<string>(addBackendToUrl),
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

export const eventType = JsonDecoder.enumeration<EventType>(EventType, 'EventType')

export const moveEvent = JsonDecoder.object<MoveEvent>(
  {
    eventType: JsonDecoder.isExactly(EventType.MOVE),
    objType: objectType,
    id: JsonDecoder.number,
    configId: JsonDecoder.number,
    startPos: cellPos,
    destPos: cellPos,
    startTime: JsonDecoder.number,
    endTime: JsonDecoder.number,
  },
  'MoveEvent');

export const deleteEvent = JsonDecoder.object<DeleteEvent>(
  {
    eventType: JsonDecoder.isExactly(EventType.DELETE),
    objType: objectType,
    id: JsonDecoder.number,
    startTime: JsonDecoder.number,
  },
  'DeleteEvent');

export const battleEvent = JsonDecoder.oneOf<BattleEvent>(
  [moveEvent, deleteEvent], 'BattleEvent');

export const startBattle = JsonDecoder.object<StartBattle>(
  {
    name: JsonDecoder.string,
    time: JsonDecoder.number,
  },
  'StartBattle');

// TODO: remove this once it's merged into ts.data.json
// This turns a tuple of decoders into a tuple of their results.
type TupleOfResults<T extends readonly [] | readonly JsonDecoder.Decoder<any>[]> = {
  [K in keyof T]: T[K] extends JsonDecoder.Decoder<infer R> ? R : never
};
const tuple = <T extends readonly [] | readonly JsonDecoder.Decoder<any>[]>(
  decoders: T,
  decoderName: string
): JsonDecoder.Decoder<TupleOfResults<T>> => {
  return new JsonDecoder.Decoder<TupleOfResults<T>>(json => {
    if (json instanceof Array) {
      const arr = [];
      if (json.length !== decoders.length) {
        return err<TupleOfResults<T>>(`Length mismatch in <${decoderName}>: json.length (${json.length}) !== ` +
          `decoders.length  (${decoders.length}).`);
      }
      for (let i =-0; i < json.length; i++) {
        const result = decoders[i].decode(json[i]);
        if (result.isOk()) {
          arr.push(result.value);
        } else {
          return err<TupleOfResults<T>>('array error');
        }
      }
      // Cast to a tuple of the right type.
      return ok<TupleOfResults<T>>(arr as unknown as TupleOfResults<T>);
    } else {
      return err<TupleOfResults<T>>('primitive error');
    }
  });
};

const monstersDefeatedDict: JsonDecoder.Decoder<{ [name: string]: [number, number] }> =
  JsonDecoder.dictionary<[number, number]>(
    tuple([JsonDecoder.number, JsonDecoder.number], '[number, number]'),
    'monstersDefeatedDict');

const monstersDefeated: JsonDecoder.Decoder<Map<number, [number, number]>> =
  monstersDefeatedDict.map<Map<number, [number, number]>>((dict: { [name: string]: [number, number] }) => {
    let res: Map<number, [number, number]> = new Map();
    return res;
  });

export const battleResults  = JsonDecoder.object<BattleResults>({
  monstersDefeated: monstersDefeated,
  bonuses: JsonDecoder.array(JsonDecoder.number, 'number[]'),
  reward: JsonDecoder.number,
  timeSecs: JsonDecoder.number,
}, 'BattleResults');
