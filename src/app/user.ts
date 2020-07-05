export interface User {
  name: string,
  accumulatedGold: number,
  goldPerMinute: number,
  active: boolean,
}

export interface UsersContainer {
  users: User[],
}
