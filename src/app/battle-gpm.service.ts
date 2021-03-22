import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StreamDataService } from './stream-data.service';

@Injectable({
  providedIn: 'root'
})
export class BattleGpmService {

  constructor(private stream: StreamDataService) { }

  getBattleGpm(defenderName: string, attackerName: string): Observable<number> {
    return this.stream.subscribe('battleGpm', defenderName, attackerName)
      .pipe(map(strData => parseFloat(strData)));
  }
}
