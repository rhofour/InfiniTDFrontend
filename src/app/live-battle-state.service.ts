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
export class LiveBattleStateService {
  constructor(private sseService: SseService) { }

  getLiveBattleState(username: string): Observable<BattleState> {
    return this.sseService
      .getServerSentEvent(backend.address + '/battleStream/' + username)
      .pipe(scan((battleState: BattleState, resp: unknown) => {
        const respEvent = resp as MessageEvent;
        const event = JSON.parse(respEvent.data);
        const decodedMetadata = decoders.battleMetadata.decode(event);
        if (decodedMetadata.isOk()) {
          return battleState.processBattleMetadata(decodedMetadata.value);
        }
        const decodedResults = decoders.battleResults.decode(event);
        if (decodedResults.isOk()) {
          return battleState.processResults(decodedResults.value);
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
      }, new BattleState()));
  }
}
