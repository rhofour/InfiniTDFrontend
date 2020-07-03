import { JsonDecoder } from 'ts.data.json';

export interface ToplevelUser {
  name: string,
  accumulatedGold: number,
  goldPerMinute: number,
}

export interface ToplevelUsersContainer {
  users: ToplevelUser[],
}

export const toplevelUserDecoder = JsonDecoder.object<ToplevelUser>(
  {
    name: JsonDecoder.string,
    accumulatedGold: JsonDecoder.number,
    goldPerMinute: JsonDecoder.number,
  },
  'ToplevelUser'
);

export const toplevelUsersContainerDecoder = JsonDecoder.object<ToplevelUsersContainer>(
  {
    users: JsonDecoder.array<ToplevelUser>(toplevelUserDecoder, 'ToplevelUser[]')
  },
  'ToplevelUserContainer'
);
