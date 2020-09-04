import { BattlegroundState, TowersBgState, TowerBgState } from './battleground-state';

const tower0State: TowerBgState = {
  id: 0,
};
const tower1State: TowerBgState = {
  id: 1,
};

export const mockTowersBgState: TowersBgState = {
  towers: [
    [undefined, tower0State, undefined, undefined],
    [undefined, tower1State, undefined, undefined],
    [undefined, undefined, undefined, undefined],
  ],
};

export const mockBattlegroundState: BattlegroundState = {
  towers: mockTowersBgState,
};
