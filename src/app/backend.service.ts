import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User as FbUser } from 'firebase/app';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
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
    this.updateCurrentUser();
    afAuth.onAuthStateChanged((fbUser) => this.updateUser(fbUser));
  }

  updateCurrentUser() {
    this.afAuth.currentUser.then((fbUser) => this.updateUser(fbUser));
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
          console.log("Found registered user.");
          this.unregistered$.next(false);
          this.user$.next(decoded.value);
        } else {
          // We have a Firebase user, but no associated user in our backend.
          console.log("Found unregistered user.");
          this.unregistered$.next(true);
          this.user$.next(null);
        }
      });
    });
  }

  authenticatedHttp(url: string, method = "get"): Promise<Object> {
    console.log('Sending authenticated request to ' + url);
    return this.afAuth.currentUser.then((fbUser) => {
      if (fbUser === null) {
        throw new Error("Could not send authenticated HTTP because there is no Firebase user logged in.");
      }
      return fbUser.getIdToken()
    }, (err) => {
      throw new Error("Error getting current Firebase user: " + err);
    }).then((idToken) => {
      if (idToken) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken,
          })
        };
        console.log("Actually sending request to " + url);
        return this.http.request(method, url, httpOptions).toPromise();
      }
      throw new Error("No authenticated user.");
    }, (err) => {
      throw new Error("Error getting ID token user: " + err);
    });
  }

  authenticatedHttpWithResponse(url: string, method = "get"): Promise<HttpResponse<Object>> {
    console.log('Sending authenticated request to ' + url);
    return this.afAuth.currentUser.then((fbUser) => {
      if (fbUser === null) {
        throw new Error("Could not send authenticated HTTP because there is no Firebase user logged in.");
      }
      return fbUser.getIdToken()
    }, (err) => {
      throw new Error("Error getting current Firebase user: " + err);
    }).then((idToken) => {
      if (idToken) {
        console.log("Actually sending request to " + url);
        return this.http.request(method, url, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken,
          }),
          observe: "response"
        }).toPromise();
      }
      throw new Error("No authenticated user.");
    }, (err) => {
      throw new Error("Error getting ID token user: " + err);
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

  isNameTaken(name: string): Promise<boolean> {
    // This will be greatly simplified when
    // https://github.com/microsoft/TypeScript/issues/21732 is fixed.
    interface IsTakenResponse {
      isTaken: boolean,
    };
    return this.http.get<IsTakenResponse>(environment.serverAddress + '/isNameTaken/' + name).toPromise().then(resp => {
      if (resp && resp.isTaken !== undefined && typeof resp.isTaken === "boolean") {
        return resp.isTaken;
      }
      return Promise.reject(new Error("Could not parse response from isNameTaken: " + resp));
    }, error => {
      console.error("Error in response from isNameTaken/" + name + ": " + error);
      return Promise.reject(error);
    });
  }

  register(name: string): Promise<string | null> {
    return this.authenticatedHttpWithResponse(
      environment.serverAddress + '/register/' + name, 'post').then((resp: HttpResponse<Object>) => {
        if (resp.status == 201) {
          console.log("Registration successful.");
          this.updateCurrentUser();
          return null;
        }
        return "Unknown success.";
    }, (resp: HttpErrorResponse) => {
      if (resp.status == 412) {
        return "Name already taken.";
      }
      return "Unknown error.";
    });
  }
}
