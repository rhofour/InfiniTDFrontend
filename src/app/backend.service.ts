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
import { OuterUser } from './outer-user';
import * as backend from './backend';
import { CellPosData } from './types';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  outerUser$: BehaviorSubject<OuterUser> = new BehaviorSubject<OuterUser>(new OuterUser());

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

  getOuterUser(): Observable<OuterUser> {
    return this.outerUser$.asObservable();
  }

  getRegisteredUser(): Observable<User | undefined> {
    return this.outerUser$.pipe(map(x => x?.user));
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
        this.outerUser$.next(new OuterUser());
        return;
      }
      // Send request to get info to build a User.
      this.authenticatedHttp(fbUser, backend.address + '/thisUser').then((user) => {
        let decoded = decoders.user.decode(user);
        if (decoded.isOk()) {
          this.outerUser$.next(new OuterUser(fbUser, decoded.value));
        } else {
          throw new Error(`Error decoding User: ${decoded.error}`);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 404) {
          // We have a Firebase user, but no associated user in our backend.
          // Likely the user hasn't registered yet.
          this.outerUser$.next(new OuterUser(fbUser));
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

  register(outerUser: OuterUser, name: string): Promise<string | null> {
    if (outerUser.fbUser === undefined) {
      throw Error("Cannot register a user who isn't logged in.");
    }
    return this.authenticatedHttpWithResponse(
      outerUser.fbUser,
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

  build(outerUser: OuterUser, towerId: number, towerPositions: CellPosData[]): Promise<Object> {
    const name = outerUser?.user?.name;
    if (name === undefined || outerUser.fbUser === undefined) {
      return Promise.reject(new Error("Cannot build for user who is not registered."));
    }
    const url = `${backend.address}/build/${encodeURIComponent(name)}`;
    let rows: number[] = [];
    let cols: number[] = [];
    for (const tower of towerPositions) {
      rows.push(tower.row);
      cols.push(tower.col);
    }
    const towerIds = new Array(towerPositions.length).fill(towerId);
    const postData = {
      "towerIds": towerIds,
      "rows": rows,
      "cols": cols,
    }
    return this.authenticatedHttpWithResponse(
      outerUser.fbUser, url, 'post', postData);
  }

  sell(outerUser: OuterUser, towerPositions: CellPosData[]): Promise<Object> {
    const name = outerUser?.user?.name;
    if (name === undefined || outerUser.fbUser === undefined) {
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
      outerUser.fbUser, url, 'post', postData);
  }

  setWave(outerUser: OuterUser, monsters: number[]): Promise<Object> {
    const name = outerUser?.user?.name;
    if (name === undefined || outerUser.fbUser === undefined) {
      return Promise.reject(new Error("Cannot add to wave for user who is not registered."));
    }
    const url = `${backend.address}/wave/${encodeURIComponent(name)}`;
    const data = { monsters: monsters };
    return this.authenticatedHttpWithResponse(
      outerUser.fbUser, url, 'post', data);
  }

  clearWave(outerUser: OuterUser): Promise<Object> {
    const name = outerUser?.user?.name;
    if (name === undefined || outerUser.fbUser === undefined) {
      return Promise.reject(new Error("Cannot clear wave for user who is not registered."));
    }
    const url = `${backend.address}/wave/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(outerUser.fbUser, url, 'delete');
  }

  startBattle(outerUser: OuterUser): Promise<Object> {
    const name = outerUser?.user?.name;
    if (name === undefined || outerUser.fbUser === undefined) {
      return Promise.reject(new Error("Cannot start battle for user who is not registered."));
    }
    const url = `${backend.address}/controlBattle/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(outerUser.fbUser, url, 'post');
  }

  stopBattle(outerUser: OuterUser): Promise<Object> {
    const name = outerUser?.user?.name;
    if (name === undefined || outerUser.fbUser === undefined) {
      return Promise.reject(new Error("Cannot stop battle for user who is not registered."));
    }
    const url = `${backend.address}/controlBattle/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(outerUser.fbUser, url, 'delete');
  }

  resetGameData(outerUser: OuterUser): Promise<Object> {
    if (outerUser.fbUser === undefined) {
      return Promise.reject(new Error("Reset game request came from a not logged in user."));
    }
    if (outerUser?.user?.admin !== true) {
      return Promise.reject(new Error("Reset game request came from a non-admin user."));
    }
    const url = `${backend.address}/admin/resetGame`;
    return this.authenticatedHttpWithResponse(outerUser.fbUser, url, 'post');
  }

  deleteAccount(outerUser: OuterUser): Promise<Object> {
    const name = outerUser?.user?.name;
    if (name === undefined || outerUser.fbUser === undefined) {
      return Promise.reject(new Error("Cannot delete an unregistered account."));
    }
    const url = `${backend.address}/deleteAccount/${encodeURIComponent(name)}`;
    return this.authenticatedHttpWithResponse(outerUser.fbUser, url, 'delete');
  }
}
