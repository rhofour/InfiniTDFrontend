import { JsonDecoder } from 'ts.data.json';

import { User, UsersContainer } from './user'

export const user = JsonDecoder.object<User>(
  {
    name: JsonDecoder.string,
    accumulatedGold: JsonDecoder.number,
    goldPerMinute: JsonDecoder.number,
  },
  'User'
);

export const usersContainer = JsonDecoder.object<UsersContainer>(
  {
    users: JsonDecoder.array<User>(user, 'User[]')
  },
  'UserContainer'
);
