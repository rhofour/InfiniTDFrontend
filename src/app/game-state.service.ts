import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { BackgroundState, TowersState, TowerState, GameState } from './game-state';
import { GameConfigService } from './game-config.service';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private background$: BehaviorSubject<BackgroundState> =
    new BehaviorSubject<BackgroundState>({ids: []});
  private towers$: BehaviorSubject<TowersState> =
    new BehaviorSubject<TowersState>({towers: []});
  private rows = 0;
  private cols = 0;

  constructor(
    private gameConfigService: GameConfigService,
  ) {
    gameConfigService.getConfig().subscribe((config) => {
      this.rows = config.playfield.numRows;
      this.cols = config.playfield.numCols;
    });
  }

  getBackground$(): Observable<BackgroundState> {
    return this.background$.asObservable();
  }

  getTowers$(): Observable<TowersState> {
    return this.towers$.asObservable();
  }

  changeUser(username: string) {
    // Initial mock data.
    let background: BackgroundState = { ids: [] };
    let towers: TowersState = { towers: [] };

    const towerState1: TowerState = {
      id: 0,
    }
    const towerState2: TowerState = {
      id: 1,
    }

    for (var row = 0; row < this.rows; row++) {
      towers.towers[row] = [];
      background.ids[row] = [];
      for (var col = 0; col < this.cols; col++) {
        if (Math.random() < 0.25) {
          towers.towers[row][col] = (row % 3 == 0 ? towerState1 : towerState2);
        }
        background.ids[row][col] = Math.random() > 0.1 ? 0 : 1;
      }
    }

    this.background$.next(background);
    this.towers$.next(towers);
  }

  getState(): GameState {
    return {
      background: this.background$.getValue(),
      towers: this.towers$.getValue(),
    }
  }
}
