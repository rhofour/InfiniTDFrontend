import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  loginErrorMsg = '';
  registrationErrorMsg = '';
  desiredName = new FormControl('', [
    Validators.minLength(2),
  ]);

  constructor(
    public afAuth: AngularFireAuth,
    public backend: BackendService,
  ) { }

  loginError(err: auth.Error) {
    console.log(err);
    this.loginErrorMsg = 'Login error: ' + err.message;
  }

  googleLogin() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).catch(err => { this.loginError(err); });
  }

  setName(loggedInUser: LoggedInUser) {
    const name = this.desiredName.value;
    if (this.desiredName.invalid) {
      console.log('Attemping to set name with invalid value: ' + name);
      return;
    }
    console.log('Attempting to set name to ' + name);
    this.backend.isNameTaken(name).then(isTaken => {
      console.log('Is name taken: ' + isTaken);
    });
    this.backend.register(loggedInUser, name).then(registrationError => {
      if (registrationError) {
        this.registrationErrorMsg = registrationError;
        console.log('registrationErrorMsg is now: ' + this.registrationErrorMsg);
      }
    });
  }

  logout() {
    console.log('Signing out.');
    this.afAuth.signOut();
  }

  ngOnInit(): void { }

}
