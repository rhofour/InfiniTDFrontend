import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { PlayfieldConfig, MonsterConfig, TowerConfig, GameConfig, emptyGameConfig } from './game-config';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  private config$: BehaviorSubject<GameConfig> = new BehaviorSubject<GameConfig>(emptyGameConfig);

  constructor() {
    let mockGameConfig = {
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

    this.config$.next(mockGameConfig);
  }

  getConfig(): Observable<GameConfig> {
    return this.config$.asObservable();
  }
}
