import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StreamDataService } from './stream-data.service';
import { BattlegroundState, TowerBgState } from './battleground-state';
import * as decoders from './decode';

@Injectable({
  providedIn: 'root'
})
export class BattlegroundStateService {
  constructor(private stream: StreamDataService) { }

  getBattlegroundState(username: string): Observable<BattlegroundState> {
    return this.stream.subscribe('battleground', username)
      .pipe(map(strData => {
        const data = JSON.parse(strData);
        let decoded = decoders.battlegroundState.decode(data);
        if (decoded.isOk()) {
          return decoded.value;
        } else {
          throw new Error('Failed to decode BattlegroundState: ' + decoded.error);
        }
      }));
  }
}
