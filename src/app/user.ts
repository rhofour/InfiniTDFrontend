export interface User {
  name: string,
  accumulatedGold: number,
  goldPerMinute: number,
}

export interface UsersContainer {
  users: User[],
}
