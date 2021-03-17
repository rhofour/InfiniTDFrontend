import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StreamDataService } from './stream-data.service';
import { User } from './user';
import * as decoders from './decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private stream: StreamDataService) { }

  getUser(username: string): Observable<User> {
    return this.stream.subscribe('user', username)
      .pipe(map(strData => {
        const data = JSON.parse(strData);
        let decoded = decoders.user.decode(data);
        if (decoded.isOk()) {
          return decoded.value;
        } else {
          throw new Error('Failed to decode User: ' + decoded.error);
        }
      }));
  }
}
