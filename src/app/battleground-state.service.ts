import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SseService } from './sse.service';
import { BattlegroundState } from './battleground-state';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BattlegroundStateService {
  constructor(private sseService: SseService) { }

  getBattlegroundState(username: string): Observable<BattlegroundState> {
    this.sseService
      .getServerSentEvent(environment.serverAddress + '/battleground/' + username)
      .subscribe(data => console.log(data));

    return new Observable(subscriber => {
      let placeholderTowers = []
      for (let r = 0; r < 14; r++) {
        placeholderTowers[r] = []
        placeholderTowers[r][9] = { id: 0 }
      }
      placeholderTowers[0][0] = { id: 1 }
      const placeholderBgState: BattlegroundState = {
        towers: {towers: placeholderTowers},
      };
      subscriber.next(placeholderBgState);
    });
  }
}
