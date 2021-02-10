import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { from, of, throwError, Observable, BehaviorSubject, pipe } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { switchMap, map, catchError, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { User, UsersContainer } from './user';
import { GameConfig, GameConfigData } from './game-config';
import * as decoders from './decode';
import { LoggedInUser } from './logged-in-user';
import * as backend from './backend';
import { CellPosData } from './types';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  loggedInUser$: BehaviorSubject<LoggedInUser | undefined> = new BehaviorSubject<LoggedInUser | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
  ) {
    this.updateCurrentUser();
    afAuth.onAuthStateChanged((fbUser) => this.updateUser(fbUser));
  }

  updateCurrentUser() {
    this.afAuth.currentUser.then((fbUser) => this.updateUser(fbUser));
  }

  getLoggedInUser(): Observable<LoggedInUser|undefined> {
    return this.loggedInUser$.asObservable();
  }

  getRegisteredUser(): Observable<User|undefined> {
    return this.loggedInUser$.pipe(map(x => x?.user));
  }

  private authenticatedHttp(fbUser: firebase.User, url: string, method = 'get'): Promise<Object> {
    return fbUser.getIdToken().then((idToken) => {
      if (idToken) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          })
        };
        return this.http.request(method, url, httpOptions).toPromise();
      }
      throw new Error('No authenticated user.');
    }, (err) => {
      throw new Error('Error getting ID token user: ' + err);
    });
  }

  // Update the user$ attribute from the Firebase user.
  updateUser(fbUser: firebase.User | null) {
    this.ngZone.run(() => {
      if (fbUser === null) {
        this.loggedInUser$.next(undefined);
        return;
      }
      // Send request to get info to build a User.
      this.authenticatedHttp(fbUser, backend.address + '/thisUser').then((user) => {
        let decoded = decoders.user.decode(user);
        if (decoded.isOk()) {
          this.loggedInUser$.next(new LoggedInUser(fbUser, decoded.value));
        } else {
          throw new Error(`Error decoding User: ${decoded.error}`);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 404) {
          // We have a Firebase user, but no associated user in our backend.
          // Likely the user hasn't registered yet.
          this.loggedInUser$.next(new LoggedInUser(fbUser));
        } else {
          console.warn(err);
          console.warn("Received unexpected error from /thisUser.");
        }
      });
    });
  }

  private authenticatedHttpWithResponse(fbUser: firebase.User, url: string,
      method = 'get', body?: any): Promise<HttpResponse<Object>> {
    return fbUser.getIdToken().then((idToken) => {
      if (idToken) {
        return this.http.request(method, url, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken,
          }),
          body: body,
          observe: 'response'
        }).toPromise();
      }
      throw new Error('No authenticated user.');
    }, (err) => {
      throw new Error('Error getting ID token user: ' + err);
    });
  }

  getUser(name: string): Promise<User | undefined> {
    return this.http.get(backend.address + '/user/' + encodeURIComponent(name)).toPromise()
      .then(resp => decoders.user.decodePromise(resp), (resp => {
        if (resp.status == 404) {
          console.log('User ' + name + ' not found.');
          return undefined;
        }
        console.warn('Unexpected failure looking up user ' + name);
        console.warn(resp);
        return undefined;
      }));
  }

  getUsers(): Observable<User[]> {
    return ajax.getJSON(backend.address + '/users').pipe(
      map(resp => {
        // Unwrap the value.
        let decoded = decoders.usersContainer.decode(resp);
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

  isNameTaken(name: string): Promise<boolean> {
    // This will be greatly simplified when
    // https://github.com/microsoft/TypeScript/issues/21732 is fixed.
    interface IsTakenResponse {
      isTaken: boolean,
    };
    return this.http.get(backend.address + '/user/' + encodeURIComponent(name)).toPromise().then(
      resp => true,
      (err: HttpErrorResponse) => {
        if (err.status === 404) {
          return false;
        }
        console.warn(err);
        return Promise.reject(new Error(`Received unexpected error from name check for ${name}`));
      }
    );
  }

  register(loggedInUser: LoggedInUser, name: string): Promise<string | null> {
    return this.authenticatedHttpWithResponse(
      loggedInUser.fbUser,
      backend.address + '/register/' + encodeURIComponent(name), 'post').then((resp: HttpResponse<Object>) => {
        if (resp.status == 201) {
          console.log('Registration successful.');
          this.updateCurrentUser();
          return null;
        }
        return 'Unknown success.';
    }, (resp: HttpErrorResponse) => {
      if (resp.status == 412) {
        return 'Name already taken.';
      }
      return 'Unknown error.';
    });
  }

  getGameConfig(): Promise<GameConfigData> {
    return this.http.get(backend.address + '/gameConfig').toPromise()
      .then((resp) => decoders.gameConfigData.decodePromise(resp));
  }

  build(loggedInUser: LoggedInUser, towerId: number, towerPositions: CellPosData[]): Promise<Object> {
    const name = loggedInUser?.user?.name;
    if (name === undefined) {
      return Promise.reject(new Error("Cannot build for user who is not registered."));
    }
    const url = `${backend.address}/build/${encodeURIComponent(name)}`;
    let rows: number[] = [];
    let cols: number[] = [];
    for (let tower of towerPositions) {
      rows.push(tower.row);
      cols.push(tower.col);
    }
    const postData = {
      "towerIds": [towerId],
      "rows": rows,
      "cols": cols,
    }
    return this.authenticatedHttpWithResponse(
      loggedInUser.fbUser, url, 'post', postData);
  }

  sell(loggedInUser: LoggedInUser, towerPositions: CellPosData[]): Promise<Object> {
    const name = loggedInUser?.user?.name;
    if (name === undefined) {
      return Promise.reject(new Error("Cannot sell for user who is not registered."));
    }
    const url = `${backend.address}/sell/${encodeURIComponent(name)}`;
    let rows: number[] = [];
    let cols: number[] = [];
    for (let tower of towerPositions) {
      rows.push(tower.row);
      cols.push(tower.col);
    }
    const postData = { "rows": rows, "cols": cols };
    return this.authenticatedHttpWithResponse(
      loggedInUser.fbUser, url, 'post', postData);
  }

  setWave(loggedInUser: LoggedInUser, monsters: number[]): Promise<Object> {
    const name = loggedInUser?.user?.name;
    if (name === undefined) {
      return Promise.reject(new Error("Cannot add to wave for user who is not registered."));
    }
    const url = `${backend.address}/wave/${encodeURIComponent(name)}`;
    const data = { monsters: monsters };
    return this.authenticatedHttpWithResponse(
      loggedInUser.fbUser, url, 'post', data);
  }

  clearWave(loggedInUser: LoggedInUser): Promise<Object> {
    const name = loggedInUser?.user?.name;
    if (name === undefined) {
      return Promise.reject(new Error("Cannot clear wave for user who is not registered."));
    }
    const url = `${backend.address}/wave/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(loggedInUser.fbUser, url, 'delete');
  }

  startBattle(loggedInUser: LoggedInUser): Promise<Object> {
    const name = loggedInUser?.user?.name;
    if (name === undefined) {
      return Promise.reject(new Error("Cannot start battle for user who is not registered."));
    }
    const url = `${backend.address}/controlBattle/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(loggedInUser.fbUser, url, 'post');
  }

  stopBattle(loggedInUser: LoggedInUser): Promise<Object> {
    const name = loggedInUser?.user?.name;
    if (name === undefined) {
      return Promise.reject(new Error("Cannot stop battle for user who is not registered."));
    }
    const url = `${backend.address}/controlBattle/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(loggedInUser.fbUser, url, 'delete');
  }

  resetGameData(loggedInUser: LoggedInUser): Promise<Object> {
    if (loggedInUser?.user?.admin !== true) {
      return Promise.reject(new Error("Reset game request comes from a non-admin user."));
    }
    const url = `${backend.address}/admin/resetGame`;
    return this.authenticatedHttpWithResponse(loggedInUser.fbUser, url, 'post');
  }

  deleteAccount(loggedInUser: LoggedInUser): Promise<Object> {
    const name = loggedInUser?.user?.name;
    if (name === undefined) {
      return Promise.reject(new Error("Cannot delete an unregistered account."));
    }
    const url = `${backend.address}/deleteAccount/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(loggedInUser.fbUser, url, 'delete');
  }
}
