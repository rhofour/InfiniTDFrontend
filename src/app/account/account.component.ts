import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';

import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  public loginErrorMsg = '';
  public registrationErrorMsg = '';
  desiredName = new FormControl('');

  constructor(
    public afAuth: AngularFireAuth,
    public backend: BackendService,
    private cdRef: ChangeDetectorRef,
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
        this.cdRef.markForCheck();
      }
    });
  }

  logout() {
    console.log('Signing out.');
    this.afAuth.signOut();
  }

  ngOnInit(): void { }

}
