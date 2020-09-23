import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

import { SseService } from './sse.service';
import { BattleState } from './battle-state';
import { environment } from '../environments/environment';
import * as decoders from './decode';

@Injectable({
  providedIn: 'root'
})
export class BattleStateService {
  constructor(private sseService: SseService) { }

  getBattleState(username: string): Observable<BattleState> {
    return this.sseService
      .getServerSentEvent(environment.serverAddress + '/battle/' + username)
      .pipe(scan((battleState: BattleState, resp: unknown) => {
        const respEvent = resp as MessageEvent;
        const event = JSON.parse(respEvent.data);
        if (typeof event === 'number') {
          battleState.setServerTime(respEvent.data);
        } else {
          const decoded = decoders.battleEvent.decode(event);
          if (decoded.isOk()) {
            battleState.processEvent(decoded.value);
          } else {
            throw new Error(
              'Failed to decode data for BattleState: ' + decoded.error);
          }
        }
        return battleState;
      }, new BattleState()));
  }
}
