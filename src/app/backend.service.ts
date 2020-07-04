import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User as FbUser } from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, throwError, Observable, BehaviorSubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { User, UsersContainer } from './user'
import * as decoders from './decode'

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  // unregistered$ is only true when we have a FB user, but no backend user.
  unregistered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
  ) {
    afAuth.currentUser.then((fbUser) => this.updateUser(fbUser));
    afAuth.onAuthStateChanged((fbUser) => this.updateUser(fbUser));
  }

  // Update the user$ attribute from the Firebase user.
  updateUser(fbUser: FbUser | null) {
    this.ngZone.run(() => {
      if (fbUser === null) {
        console.log("User not signed in.");
        this.unregistered$.next(false);
        this.user$.next(null);
        return
      }
      // Send request to get info to build a User.
      this.authenticatedHttp(environment.serverAddress + '/thisUser').then((user) => {
        let decoded = decoders.user.decode(user);
        if (decoded.isOk()) {
          console.log("Found registered user.")
          this.unregistered$.next(false);
          this.user$.next(decoded.value);
        } else {
          // We have a Firebase user, but no associated user in our backend.
          console.log("Found unregistered user.")
          this.unregistered$.next(true);
          this.user$.next(null);
        }
      });
    });
  }

  authenticatedHttp(url: string): Promise<unknown> {
    console.log('Sending authenticated request to ' + url);
    return this.afAuth.currentUser.then((fbUser) => {
      if (fbUser === null) {
        console.warn("Could not send authenticated HTTP because there is no Firebase user logged in.");
        return;
      }
      fbUser.getIdToken().then((idToken) => {
        if (idToken) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + idToken,
            })
          };
          console.log("Actually sending request to " + url);
          return this.http.get(url, httpOptions);
        }
        return throwError('No authenticated user.');
      }, (err) => {
        console.warn(err);
      });
    }, (err) => {
      console.warn("Error getting current Firebase user: " + err);
    });
  }

  getUser() { return this.user$; }

  getUnregistered() { return this.unregistered$; }

  getUsers(): Observable<User[]> {
    return ajax.getJSON(environment.serverAddress + '/users').pipe(
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
}
