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
  requestBattleState(defenderName: string, attackerName: string) {
    console.log(`Requesting battle ${attackerName} vs ${defenderName}`);
    return this.http.get(`${backend.address}/battle/${encodeURIComponent(attackerName)}/${encodeURIComponent(defenderName)}`).toPromise()
      .then((resp: Object) => {
        const decodedBattle = decoders.battle.decode(resp);
        if (decodedBattle.isOk()) {
          const battle: Battle = decodedBattle.value;
          this.battleState$.next(new BattleState(battle.name, battle.attackerName, battle.defenderName, Date.now() / 1000, battle.events,
            false, battle.results));
        } else {
          console.warn(`Failed to decode battle: ${decodedBattle.error}`);
        }
      });
  }

  stopBattle() {
    // Send an empty battle state.
    this.battleState$.next(new BattleState());
  }

  getRecordedBattleState(): Observable<BattleState> {
    return this.battleState$.asObservable();
  }
}
