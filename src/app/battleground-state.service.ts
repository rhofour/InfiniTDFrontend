import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SseService } from './sse.service';
import { BattlegroundState, TowerBgState } from './battleground-state';
import { environment } from '../environments/environment';
import * as decoders from './decode';

@Injectable({
  providedIn: 'root'
})
export class BattlegroundStateService {
  constructor(private sseService: SseService) { }

  getBattlegroundState(username: string): Observable<BattlegroundState> {
    return this.sseService
      .getServerSentEvent(environment.serverAddress + '/battlegroundStream/' + username)
      .pipe(map(resp => {
        const respEvent = resp as MessageEvent;
        const data = JSON.parse(respEvent.data);
        console.log("Recieved new battleground state:");
        console.log(data);
        let decoded = decoders.battlegroundState.decode(data);
        if (decoded.isOk()) {
          return decoded.value;
        } else {
          throw new Error('Failed to decode BattlegroundState: ' + decoded.error);
        }
      }));
  }
}
