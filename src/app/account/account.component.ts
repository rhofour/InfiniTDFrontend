import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';
import { AreYouSureDialogComponent } from '../are-you-sure-dialog/are-you-sure-dialog.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  public loginErrorMsg = '';
  public registrationErrorMsg = '';
  public privacyPolicyAcknowledged = false;
  desiredName = new FormControl('');

  constructor(
    public afAuth: AngularFireAuth,
    public backend: BackendService,
    private cdRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

  loginError(err: firebase.auth.Error) {
    console.log(err);
    this.loginErrorMsg = 'Login error: ' + err.message;
  }

  googleLogin() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(err => { this.loginError(err); });
  }

  facebookLogin() {
    this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .catch(err => { this.loginError(err); });
  }

  githubLogin() {
    this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider())
      .catch(err => { this.loginError(err); });
  }

  register(loggedInUser: LoggedInUser) {
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

  deleteAccount(lUser: LoggedInUser) {
    const dialogRef = this._dialog.open(AreYouSureDialogComponent, {
      data: {
        msg: "This will wipe all account data for this user.",
        fn: (() => this.backend.deleteAccount(lUser)),
      }
    });
    dialogRef.afterClosed().subscribe((result: Promise<Object>) => {
      result.then(
        _ => {
          this._snackBar.open("Account successfully deleted.", "Dismiss");
        },
        err => {
          console.warn("Error deleting account.");
          this._snackBar.open(`Error: ${err.message}`, "Dismiss")
        },
      );
    });
  }

  ngOnInit(): void { }

}
