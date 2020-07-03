import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { FormControl, Validators } from '@angular/forms';

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginErrorMsg: string = "";
  desiredName = new FormControl('', [
    Validators.minLength(2),
  ]);
  desireNameErrors

  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
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
    this.afAuth.signOut();
  }

  ngOnInit(): void {
  }

}
