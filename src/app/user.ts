export interface User {
  name: string,
  accumulatedGold: number,
  gold: number,
  goldPerMinute: number,
  active: boolean,
}

export interface UsersContainer {
  users: User[],
}
