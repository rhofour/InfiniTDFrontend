import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SseService } from './sse.service';
import { Rivals } from './rivals';
import * as decoders from './decode';
import * as backend from './backend';

@Injectable({
  providedIn: 'root'
})
export class RivalsService {
  constructor(private sseService: SseService) { }

  getRivals(username: string): Observable<Rivals> {
    return this.sseService
      .getServerSentEvent(backend.address + '/rivalsStream/' + username)
      .pipe(map(resp => {
        const respEvent = resp as MessageEvent;
        const data = JSON.parse(respEvent.data);
        let decoded = decoders.rivals.decode(data);
        if (decoded.isOk()) {
          return decoded.value;
        } else {
          throw new Error('Failed to decode Rivals: ' + decoded.error);
        }
      }));
  }
}
