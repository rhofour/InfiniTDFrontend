import { Pipe, PipeTransform } from '@angular/core';
const clone = require('rfdc')()

import { GameConfig } from './game-config';
import { TowersBgState } from './battleground-state';
import { pathExists } from './path';
import { BattlegroundSelectionView } from './battleground-selection';

@Pipe({
  name: 'wouldBlockPath'
})
export class WouldBlockPathPipe implements PipeTransform {
  transform(selection: BattlegroundSelectionView, gameConfig: GameConfig, towersState: TowersBgState): boolean {
    // Make a deep enough copy of the state
    let possibleTowers: TowersBgState = clone(towersState);
    const numRows = possibleTowers.towers.length;
    const numCols = possibleTowers.towers[0].length;
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (selection.isSelected(r, c)) {
          // The ID of the tower is placed is unimportant.
          possibleTowers.towers[r][c] = { id: 0 };
        }
      }
    }
    return !pathExists(possibleTowers,
      gameConfig.playfield.monsterEnter,
      gameConfig.playfield.monsterExit);
  }
}
