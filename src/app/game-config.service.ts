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
    towers: [
      {
        id: 0,
        url: environment.serverAddress + '/static/CrappyTowerSmall.png',
        name: "Boring Tower",
        cost: 1,
        firingRate: 2,
        range: 300,
        damage: 5,
      },
      {
        id: 1,
        url: environment.serverAddress + '/static/CrappyTower.png',
        name: "Better Tower",
        cost: 5,
        firingRate: 2.5,
        range: 500,
        damage: 15,
      },
    ],
  }
  constructor() { }
}
