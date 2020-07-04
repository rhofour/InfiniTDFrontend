import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { FormControl, Validators } from '@angular/forms';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  loginErrorMsg: string = "";
  desiredName = new FormControl('', [
    Validators.minLength(2),
  ]);

  constructor(
    public afAuth: AngularFireAuth,
    public backend: BackendService,
  ) { }

  loginError(err: auth.Error) {
    console.log(err);
    this.loginErrorMsg = "Login error: " + err.message;
  }

  googleLogin() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).catch(this.loginError);
  }

  setName() {
  }

  logout() {
    console.log("Signing out.");
    this.afAuth.signOut();
  }

  ngOnInit(): void {
  }

}
