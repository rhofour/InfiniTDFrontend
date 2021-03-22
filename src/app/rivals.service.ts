import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { scan, map, switchMap } from 'rxjs/operators';

import { StreamDataService } from './stream-data.service';
import { Rivals, RivalData, RivalNames } from './rivals';
import { User } from './user';
import * as decoders from './decode';
import { UserService } from './user.service';
import { BattleGpmService } from './battle-gpm.service';

class RivalsServiceState {
  private userObs: Map<string, Observable<User>> = new Map();
  private userBattleGpmObs: Map<string, Observable<number>> = new Map();
  private aheadNames: string[] = [];
  private behindNames: string[] = [];

  constructor(
    private baseUsername: string,
    private users: UserService,
    private battleGpm: BattleGpmService,
  ) { }

  private static userToRival(user: User, gpm: number): RivalData {
    let res: RivalData = {
      name: user.name,
      wave: user.wave,
      accumulatedGold: user.accumulatedGold,
      rivalGoldPerMinuteTotal: user.goldPerMinuteSelf + user.goldPerMinuteOthers,
    };
    if (gpm >= 0) {
      res.battleGoldPerMinute = gpm;
    }
    return res;
  }

  public update(names: RivalNames): RivalsServiceState {
    const oldNames: Set<string> = new Set(this.aheadNames.concat(this.behindNames));
    const newNames: Set<string> = new Set(names.aheadNames.concat(names.behindNames));
    for (var newName of newNames) {
      if (!oldNames.has(newName)) {
        // We need to add this observable.
        this.userObs.set(newName, this.users.getUser(newName));
        this.userBattleGpmObs.set(newName, this.battleGpm.getBattleGpm(this.baseUsername, newName));
      }
    }
    for (var oldName of oldNames) {
      if (!newNames.has(oldName)) {
        // We need to remove this observable.
        this.userObs.delete(oldName);
        this.userBattleGpmObs.delete(oldName);
      }
    }
    this.aheadNames = names.aheadNames;
    this.behindNames = names.behindNames;
    return this;
  }
  public toRivals(): Observable<Rivals> {
    var obsInOrder: (Observable<User> | Observable<number>)[] = [];
    const allNames = this.aheadNames.concat(this.behindNames);
    allNames.forEach((name: string) => {
      const maybeObs = this.userObs.get(name);
      if (maybeObs === undefined) {
        throw new Error(`Expected, but didn't have obs for: ${name}`);
      }
      obsInOrder.push(maybeObs);
    });
    allNames.forEach((name: string) => {
      const maybeGpmObs = this.userBattleGpmObs.get(name);
      if (maybeGpmObs === undefined) {
        throw new Error(`Expected, but didn't have battle GPM obs for: ${name}`);
      }
      obsInOrder.push(maybeGpmObs);
    });
    return combineLatest(obsInOrder).pipe(map((usersAndGpms: (User | number)[]) => {
      const aheadUsers: User[] = usersAndGpms.slice(
        0,
        this.aheadNames.length) as User[];
      const behindUsers: User[] = usersAndGpms.slice(
        this.aheadNames.length,
        this.aheadNames.length + this.behindNames.length) as User[];
      const aheadGpms: number[] = usersAndGpms.slice(
        this.aheadNames.length + this.behindNames.length,
        2 * this.aheadNames.length + this.behindNames.length) as number[];
      const behindGpms: number[] = usersAndGpms.slice(
        2 * this.aheadNames.length + this.behindNames.length) as number[];
      return {
        aheadRivals: aheadUsers.map((user: User, i) => RivalsServiceState.userToRival(user, aheadGpms[i])),
        behindRivals: behindUsers.map((user: User, i) => RivalsServiceState.userToRival(user, behindGpms[i])),
      }
    }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class RivalsService {
  constructor(
    private stream: StreamDataService,
    private users: UserService,
    private battleGpm: BattleGpmService,
  ) { }

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
      }, new RivalsServiceState(username, this.users, this.battleGpm)))
      .pipe(switchMap(x => x.toRivals()));
  }
}
