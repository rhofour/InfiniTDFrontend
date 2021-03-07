export interface User {
  name: string,
  accumulatedGold: number,
  gold: number,
  goldPerMinuteSelf: number,
  goldPerMinuteOthers: number,
  inBattle: boolean,
  wave: number[],
  admin: boolean,
}

export interface UsersContainer {
  users: User[],
}
