import { Injectable } from '@angular/core';
import { ToplevelUser } from './toplevel-user'
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToplevelUsersService {
  users : ToplevelUser[] = [
    { name: 'rofer', accumulatedGold: 100.0, goldPerMinute: 5.0 },
    { name: 'other', accumulatedGold: 42.12, goldPerMinute: 1.0 },
    { name: 'newUser', accumulatedGold: 0.0, goldPerMinute: 0.0 },
  ];

  constructor() { }

  getUsers(): Observable<ToplevelUser[]> {
    return of(this.users);
  }

  getUser(username: string): Observable<ToplevelUser | null> {
    let user = this.users.find(user => user.name === username);
    return of(user ? user : null);
  }
}
