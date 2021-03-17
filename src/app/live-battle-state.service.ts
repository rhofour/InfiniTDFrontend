import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { StreamDataService } from './stream-data.service';
import { BattleState } from './battle-state';
import * as decoders from './decode';

@Injectable({
  providedIn: 'root'
})
export class LiveBattleStateService {
  constructor(private stream: StreamDataService) { }

  getLiveBattleState(username: string): Observable<BattleState> {
    return this.stream.subscribe('battle', username)
      .pipe(scan((battleState: BattleState, respStr: string) => {
        const event = JSON.parse(respStr);
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
