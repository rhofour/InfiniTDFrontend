import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { BattleState, Battle } from './battle-state';
import * as decoders from './decode';
import * as backend from './backend';

@Injectable({
  providedIn: 'root'
})
export class RecordedBattleStateService {
  private battleState$: Subject<BattleState> = new Subject();

  constructor(
    private http: HttpClient,
  ) { }

  // Changes the observable returned by getRecordedBattleState
  requestBattleState(attackerName: string, defenderName: string) {
    console.log(`Requesting battles ${attackerName} vs ${defenderName}`);
    this.http.get(`${backend.address}/battle/${attackerName}/${defenderName}`).toPromise()
      .then(resp => {
        const decodedBattle = decoders.battle.decode(resp);
        if (decodedBattle.isOk()) {
          const battle: Battle = decodedBattle.value;
          this.battleState$.next(new BattleState(battle.name, Date.now() / 1000, battle.events,
            false, battle.results));
        } else {
          console.warn(`Failed to decode battle: ${decodedBattle.error}`);
        }
      });
    return;
  }

  stopBattle() {
    // Send an empty battle state.
    this.battleState$.next(new BattleState(''));
  }

  getRecordedBattleState(): Observable<BattleState> {
    return this.battleState$.asObservable();
  }
}
