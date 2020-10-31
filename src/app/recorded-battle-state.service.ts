import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { BattleState } from './battle-state';
import * as decoders from './decode';
import * as backend from './backend';

@Injectable({
  providedIn: 'root'
})
export class RecordedBattleStateService {
  private battleState$: Subject<BattleState> = new Subject();

  constructor() { }

  // Changes the observable returned by getRecordedBattleState
  requestBattleState(attacker: string, defender: string) {
    return;
  }

  getRecordedBattleState(): Observable<BattleState> {
    return this.battleState$.asObservable();
  }
}
