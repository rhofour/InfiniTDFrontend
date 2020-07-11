export interface BackgroundState {
  ids: number[][],
}

export interface TowerState {
  id: number,
}

export interface TowersState {
  towers: TowerState[][],
}

export interface GameState {
  background: BackgroundState,
  towers: TowersState,
}
