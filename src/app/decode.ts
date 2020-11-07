import { JsonDecoder, err, ok } from 'ts.data.json';

import { CellPos, CellPosData } from './types';
import { User, UsersContainer } from './user';
import { TileConfig, PlayfieldConfig, MonsterConfig, TowerConfig, ProjectileConfig, GameConfigData, MiscConfigData, BonusType, BonusCondition, BattleBonus } from './game-config';
import { TowerBgState, TowersBgState, BattlegroundState } from './battleground-state';
import { ObjectType, EventType, MoveEvent, DeleteEvent, DamageEvent, BattleEvent, BattleStatus, BattleMetadata, BattleResults, Battle } from './battle-state';
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
    tileSize: JsonDecoder.number,
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
    projectileSpeed: JsonDecoder.number,
    projectileId: JsonDecoder.number,
  },
  'TowerConfig');

export const projectileConfig = JsonDecoder.object<ProjectileConfig>(
  {
    id: JsonDecoder.number,
    url: JsonDecoder.string.map<string>(addBackendToUrl),
    size: JsonDecoder.number,
  },
  'ProjectileConfig');

export const bonusType = JsonDecoder.enumeration<BonusType>(BonusType, 'BonusType');

export const bonusCondition = JsonDecoder.object<BonusCondition>(
  {
    percentDefeated: JsonDecoder.number,
  }, 'BonusCondition');

export const battleBonus = JsonDecoder.object<BattleBonus>(
  {
    id: JsonDecoder.number,
    name: JsonDecoder.string,
    bonusType: bonusType,
    bonusAmount: JsonDecoder.number,
    conditions: JsonDecoder.array<BonusCondition>(bonusCondition, 'BonusCondition[]'),
  }, 'BattleBonus');

export const miscConfigData = JsonDecoder.object<MiscConfigData>(
  {
    sellMultiplier: JsonDecoder.number,
    battleBonuses: JsonDecoder.array<BattleBonus>(battleBonus, 'BattleBonus[]'),
  },
  'MiscConfigData');

export const gameConfigData = JsonDecoder.object<GameConfigData>(
  {
    tiles: JsonDecoder.array<TileConfig>(tileConfig, 'TileConfig[]'),
    playfield: playfieldConfig,
    monsters: JsonDecoder.array<MonsterConfig>(monsterConfig, 'MonsterConfig[]'),
    towers: JsonDecoder.array<TowerConfig>(towerConfig, 'TowerConfig[]'),
    projectiles: JsonDecoder.array<ProjectileConfig>(projectileConfig, 'ProjectileConfig[]'),
    misc: miscConfigData,
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

export const objectType = JsonDecoder.enumeration<ObjectType>(ObjectType, 'ObjectType');

export const eventType = JsonDecoder.enumeration<EventType>(EventType, 'EventType');

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

export const damageEvent = JsonDecoder.object<DamageEvent>(
  {
    eventType: JsonDecoder.isExactly(EventType.DAMAGE),
    id: JsonDecoder.number,
    startTime: JsonDecoder.number,
    health: JsonDecoder.number,
  },
  'DeleteEvent');

export const battleEvent = JsonDecoder.oneOf<BattleEvent>(
  [moveEvent, deleteEvent, damageEvent], 'BattleEvent');

export const battleStatus = JsonDecoder.enumeration<BattleStatus>(BattleStatus, 'BattleStatus');
export const battleMetadata = JsonDecoder.object<BattleMetadata>(
  {
    name: JsonDecoder.string,
    status: battleStatus,
    time: JsonDecoder.optional(JsonDecoder.number),
  },
  'BattleMetadata');

const monstersDefeatedDict: JsonDecoder.Decoder<{ [name: string]: [number, number] }> =
  JsonDecoder.dictionary<[number, number]>(
    JsonDecoder.tuple([JsonDecoder.number, JsonDecoder.number], '[number, number]'),
    'monstersDefeatedDict');

const monstersDefeated: JsonDecoder.Decoder<Map<number, [number, number]>> =
  monstersDefeatedDict.map<Map<number, [number, number]>>((dict: { [name: string]: [number, number] }) => {
    let res: Map<number, [number, number]> = new Map();
    for (let [key, [numDefeated, numSent]] of Object.entries(dict)) {
      const monsterId = parseInt(key);
      if (isNaN(monsterId)) {
        console.warn(`Got non-integer monster ID (${key}) when parsing monstersDefeated.`);
        continue;
      }
      res.set(monsterId, [numDefeated, numSent]);
    }
    return res;
  });

export const battleResults = JsonDecoder.object<BattleResults>({
  monstersDefeated: monstersDefeated,
  bonuses: JsonDecoder.array(JsonDecoder.number, 'number[]'),
  reward: JsonDecoder.number,
  timeSecs: JsonDecoder.number,
}, 'BattleResults');

export const battle = JsonDecoder.object<Battle>({
  name: JsonDecoder.string,
  events: JsonDecoder.array(battleEvent, 'BattleEvent[]'),
  results: battleResults,
}, 'Battle');
