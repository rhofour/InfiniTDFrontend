export interface User {
  name: string,
  accumulatedGold: number,
  gold: number,
  goldPerMinute: number,
  inBattle: boolean,
}

export interface UsersContainer {
  users: User[],
}
