import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { PlayfieldConfig, MonsterConfig, TowerConfig, GameConfigData, emptyGameConfigData, GameConfig } from './game-config';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  private configData$: BehaviorSubject<GameConfigData> = new BehaviorSubject<GameConfigData>(emptyGameConfigData);
  private config$: BehaviorSubject<GameConfig> =
    new BehaviorSubject<GameConfig>(GameConfig.makeEmpty());

  constructor(private backend: BackendService) {

    backend.getGameConfig().then((gameConfigData: GameConfigData) => {
      this.configData$.next(gameConfigData);
      GameConfig.fromConfig(gameConfigData).then((x) => this.config$.next(x));
    });
  }

  getConfigData(): Observable<GameConfigData> {
    return this.configData$.asObservable();
  }

  getConfig(): Observable<GameConfig> {
    return this.config$.asObservable();
  }
}
