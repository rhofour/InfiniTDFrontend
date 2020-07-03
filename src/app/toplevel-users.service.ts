import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, interval, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { Ok, JsonDecoder } from 'ts.data.json';

import { ToplevelUser, ToplevelUsersContainer, toplevelUserDecoder, toplevelUsersContainerDecoder } from './toplevel-user'
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ToplevelUsersService {
  constructor(
    private readonly http: HttpClient) { }

  getUsers(): Observable<ToplevelUser[]> {
    return ajax.getJSON(environment.serverAddress + '/users').pipe(
      map(resp => {
        // Unwrap the value.
        let decoded = toplevelUsersContainerDecoder.decode(resp);
        if (decoded.isOk()) {
          return decoded.value.users;
        }
        console.warn('/users replied without users property');
        console.warn(resp);
        return [];
      }),
      catchError(err => {
        console.warn(err);
        return of(err);
      })
    );
  }

  getUser(username: string): Observable<ToplevelUser | null> {
    return ajax.getJSON(environment.serverAddress + '/user/' + username).pipe(
      map(resp => {
        let decoded = toplevelUserDecoder.decode(resp);
        if (decoded.isOk()) {
          return decoded.value;
        }
        console.warn('/user/' + username + ' replied without user');
        console.warn(resp);
        return null;
      }),
      catchError(err => {
        console.warn(err);
        return of(null);
      })
    );
  }
}
