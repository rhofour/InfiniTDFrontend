import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User as FbUser } from 'firebase/app';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../environments/environment';

export interface User {
  displayName: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
  ) {
    afAuth.onAuthStateChanged((fbUser: FbUser | null) => {
      if (fbUser) {
        // Send request to get info to build a User.
        fbUser.getIdToken().then((idToken: string) => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + idToken,
            })
          };
          this.http.get<User>(environment.serverAddress + '/uid/' + fbUser.uid, httpOptions)
          .subscribe((user: User) => {
            this.user$.next(user);
          });
        });
      } else {
        this.user$.next(null);
      }
    });
  }

  getUser() { return this.user$; }
}
