export interface TowerBgState {
  id: number,
}

export interface TowersBgState {
  towers: (TowerBgState | undefined)[][],
}

export interface BattlegroundState {
  towers: TowersBgState,
}
