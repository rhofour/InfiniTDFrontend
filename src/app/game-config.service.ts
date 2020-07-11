import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { PlayfieldConfig, MonsterConfig, TowerConfig, GameConfig } from './game-config';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {

  config: GameConfig = {
    tiles: [
      { id: 0, url: environment.serverAddress + '/static/CrappyGrass.png' },
      { id: 1, url: environment.serverAddress + '/static/CrappyDirt.png' },
    ],
    playfield: {
      numCols: 10,
      numRows: 14,
      monsterEnter: { row:0, col: 0 },
      monsterExit: { row:9, col: 0 },
    },
    monsters: [],
    towers: [],
  }
  constructor() { }
}
