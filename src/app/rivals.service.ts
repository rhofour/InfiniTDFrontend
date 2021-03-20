import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { scan, map, switchMap } from 'rxjs/operators';

import { StreamDataService } from './stream-data.service';
import { Rivals, RivalData, RivalNames } from './rivals';
import { User } from './user';
import * as decoders from './decode';

class RivalsServiceState {
  private userSubs: Map<string, Subscription> = new Map();
  private userObs: Map<string, Observable<User>> = new Map();
  private aheadNames: string[] = [];
  private behindNames: string[] = [];

  private static userToRival(user: User): RivalData {
    return {
      name: user.name,
      rivalGoldPerMinuteTotal: user.goldPerMinuteSelf + user.goldPerMinuteOthers,
    };
  }

  public update(names: RivalNames): RivalsServiceState {
    const oldNames: Set<string> = new Set(this.aheadNames.concat(this.behindNames));
    const newNames: Set<string> = new Set(names.aheadNames.concat(names.behindNames));
    for (var newName of newNames) {
      if (!oldNames.has(newName)) {
        // We need to start this subscription.
      }
    }
    for (var oldName of oldNames) {
      if (!newNames.has(oldName)) {
        // We need to clean up this subscription.
      }
    }
    return this;
  }
  public toRivals(): Observable<Rivals> {
    var obsInOrder: Observable<User>[] = [];
    this.aheadNames.concat(this.behindNames).forEach((name: string) => {
      const maybeObs = this.userObs.get(name);
      if (maybeObs === undefined) {
        throw new Error(`Expected, but didn't have obs for: ${name}`);
      }
      obsInOrder.push(maybeObs);
    });
    return combineLatest(obsInOrder).pipe(map((users: User[]) => {
      const aheadUsers = users.slice(0, this.aheadNames.length);
      const behindUsers = users.slice(this.aheadNames.length);
      return {
        aheadRivals: aheadUsers.map(user => RivalsServiceState.userToRival(user)),
        behindRivals: behindUsers.map(user => RivalsServiceState.userToRival(user)),
      }
    }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class RivalsService {
  constructor(private stream: StreamDataService) { }

  getRivals(username: string): Observable<Rivals> {
    return this.stream.subscribe('rivals', username)
      .pipe(scan((state: RivalsServiceState, strData: string) => {
        const data = JSON.parse(strData);
        let decoded = decoders.rivalNames.decode(data);
        if (decoded.isOk()) {
          return state.update(decoded.value);
        } else {
          throw new Error('Failed to decode Rivals: ' + decoded.error);
        }
      }, new RivalsServiceState()))
      .pipe(switchMap(x => x.toRivals()));
  }
}
