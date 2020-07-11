export interface TowerState {
  id: number,
}

export interface TowersState {
  towers: TowerState[][],
}

export interface GameState {
  towers: TowersState,
}
