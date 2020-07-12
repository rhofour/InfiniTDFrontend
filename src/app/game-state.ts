export interface BackgroundState {
  ids: number[][],
}

export interface TowerState {
  id: number,
}

export interface TowersState {
  towers: (TowerState | null)[][],
}

export interface GameState {
  background: BackgroundState,
  towers: TowersState,
}
