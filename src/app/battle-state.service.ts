import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
      .pipe(map(resp => {
        console.log(resp);
        return { events: [] }
      }));
  }
}
