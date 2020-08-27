import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { PlayfieldConfig, MonsterConfig, TowerConfig, GameConfigData, GameConfig } from './game-config';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  private config$: ReplaySubject<GameConfig> =
    new ReplaySubject<GameConfig>(1);

  constructor(private backend: BackendService) {

    backend.getGameConfig().then((gameConfigData: GameConfigData) => {
      GameConfig.fromConfig(gameConfigData).then((x) => this.config$.next(x));
    });
  }

  getConfig(): Observable<GameConfig> {
    return this.config$.asObservable();
  }
}
