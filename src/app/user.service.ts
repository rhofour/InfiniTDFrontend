import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SseService } from './sse.service';
import { User } from './user';
import { environment } from '../environments/environment';
import * as decoders from './decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private sseService: SseService) { }

  getUser(username: string): Observable<User> {
    return this.sseService
      .getServerSentEvent(environment.serverAddress + '/userStream/' + username)
      .pipe(map(resp => {
        const respEvent = resp as MessageEvent;
        const data = JSON.parse(respEvent.data);
        let decoded = decoders.user.decode(data);
        if (decoded.isOk()) {
          return decoded.value;
        } else {
          throw new Error('Failed to decode User: ' + decoded.error);
        }
      }));
  }
}
