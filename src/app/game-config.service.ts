import { Injectable } from '@angular/core';

import { PlayfieldConfig, MonsterConfig, TowerConfig, GameConfig } from './game-config';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {

  config: GameConfig = {
    playfield: {
      width: 10,
      height: 14,
      monsterEnter: { row:0, col: 0 },
      monsterExit: { row:9, col: 0 },
    },
    monsters: [],
    towers: [],
  }
  constructor() { }
}
