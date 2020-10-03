import { Pipe, PipeTransform } from '@angular/core';
const clone = require('rfdc')()

import { GridSelection } from './selection.service';
import { GameConfig } from './game-config';
import { TowersBgState } from './battleground-state';
import { findShortestPaths } from './path';

@Pipe({
  name: 'wouldBlockPath'
})
export class WouldBlockPathPipe implements PipeTransform {
  transform(selection: GridSelection, gameConfig: GameConfig, towersState: TowersBgState): boolean {
    // Make a deep enough copy of the state
    let possibleTowers: TowersBgState = clone(towersState);
    // Which tower is placed is unimportant.
    possibleTowers.towers[selection.row][selection.col] = { id: 0 };
    const paths = findShortestPaths(
      possibleTowers,
      gameConfig.playfield.monsterEnter,
      gameConfig.playfield.monsterExit);
    return paths.length === 0;
  }
}
