import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StreamDataService } from './stream-data.service';
import { Rivals } from './rivals';
import * as decoders from './decode';
import * as backend from './backend';

@Injectable({
  providedIn: 'root'
})
export class RivalsService {
  constructor(private stream: StreamDataService) { }

  getRivals(username: string): Observable<Rivals> {
    return this.stream.subscribe('rivals', username)
      .pipe(map(strData => {
        const data = JSON.parse(strData);
        let decoded = decoders.rivals.decode(data);
        if (decoded.isOk()) {
          return decoded.value;
        } else {
          throw new Error('Failed to decode Rivals: ' + decoded.error);
        }
      }));
  }
}
