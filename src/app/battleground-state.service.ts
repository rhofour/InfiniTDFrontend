import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SseService } from './sse.service';
import { BattlegroundState, TowerBgState } from './battleground-state';
import * as decoders from './decode';
import * as backend from './backend';

@Injectable({
  providedIn: 'root'
})
export class BattlegroundStateService {
  constructor(private sseService: SseService) { }

  getBattlegroundState(username: string): Observable<BattlegroundState> {
    return this.sseService
      .getServerSentEvent(backend.address + '/battlegroundStream/' + username)
      .pipe(map(resp => {
        const respEvent = resp as MessageEvent;
        const data = JSON.parse(respEvent.data);
        let decoded = decoders.battlegroundState.decode(data);
        if (decoded.isOk()) {
          return decoded.value;
        } else {
          throw new Error('Failed to decode BattlegroundState: ' + decoded.error);
        }
      }));
  }
}
