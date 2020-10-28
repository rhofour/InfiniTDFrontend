import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { SseService } from './sse.service';
import { BattleState } from './battle-state';
import * as decoders from './decode';
import * as backend from './backend';

@Injectable({
  providedIn: 'root'
})
export class BattleStateService {
  constructor(private sseService: SseService) { }

  getBattleState(username: string): Observable<BattleState> {
    return this.sseService
      .getServerSentEvent(backend.address + '/battle/' + username)
      .pipe(scan((battleState: BattleState, resp: unknown) => {
        const respEvent = resp as MessageEvent;
        const event = JSON.parse(respEvent.data);
        const decodedStart = decoders.startBattle.decode(event);
        if (decodedStart.isOk()) {
          return battleState.processStartBattle(decodedStart.value);
        }
        const decodedResults = decoders.battleResults.decode(event);
        if (decodedResults.isOk()) {
          console.log(decodedResults.value);
          // TODO: write battleState.processResults
        }
        const decodedEvent = decoders.battleEvent.decode(event);
        if (decodedEvent.isOk()) {
          battleState.processEvent(decodedEvent.value);
        } else {
          console.warn(event);
          throw new Error(
            'Failed to decode data for BattleEvent: ' + decodedEvent.error);
        }
        return battleState;
      }, new BattleState(undefined)));
  }
}
