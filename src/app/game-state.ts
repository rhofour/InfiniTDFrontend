export interface TowerState {
  id: number,
}

export interface PlayfieldState {
  towers: TowerState[][],
}

export interface GameState {
  playfield: PlayfieldState,
}
