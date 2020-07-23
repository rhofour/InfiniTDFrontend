import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { BackgroundState, TowersState, TowerState, GameState, ConfigHash } from './game-state';
import { GameConfigService } from './game-config.service';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private emptyBackground: BackgroundState & ConfigHash = { ids: [], configHash: 0};
  private background$: BehaviorSubject<BackgroundState & ConfigHash> =
    new BehaviorSubject<BackgroundState & ConfigHash>(this.emptyBackground);
  private emptyTowers: TowersState & ConfigHash = { towers: [], configHash: 0};
  private towers$: BehaviorSubject<TowersState & ConfigHash> =
    new BehaviorSubject<TowersState & ConfigHash>(this.emptyTowers);
  private hash: ConfigHash = { configHash: 0 };
  private rows = 0;
  private cols = 0;
  private username: string | null = null;

  constructor(
    private gameConfigService: GameConfigService,
  ) {
    gameConfigService.getConfig().subscribe((config) => {
      this.rows = config.playfield.numRows;
      this.cols = config.playfield.numCols;
      this.hash.configHash = config.hash;

      this.requestState();
    });
  }

  getBackground$(): Observable<BackgroundState & ConfigHash> {
    return this.background$.asObservable();
  }

  getTowers$(): Observable<TowersState & ConfigHash> {
    return this.towers$.asObservable();
  }

  changeUser(username: string | null) {
    const prevUsername = this.username;
    this.username = username;
    if (username) {
      if (username !== prevUsername) {
        this.requestState();
      }
    } else {
      this.resetState();
    }
  }

  resetState() {
    this.background$.next(this.emptyBackground);
    this.towers$.next(this.emptyTowers);
    this.hash = { configHash: 0 };
  }

  requestState() {
    // Initial mock data.
    let background: BackgroundState = { ids: [] };
    let towers: TowersState = { towers: [] };
    const hash: ConfigHash = { configHash: 1 };

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
        } else {
          towers.towers[row][col] = undefined;
        }
        background.ids[row][col] = Math.random() > 0.1 ? 0 : 1;
      }
    }

    this.background$.next({...background, ...hash});
    this.towers$.next({...towers, ...hash});
  }

  getState(): GameState {
    return {
      background: this.background$.getValue(),
      towers: this.towers$.getValue(),
      ...this.hash,
    }
  }
}
