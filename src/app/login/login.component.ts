import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginErrorMsg: string = "";

  constructor(
    public afAuth: AngularFireAuth
  ) { }

  loginError(err: auth.Error) {
    console.log(err);
    this.loginErrorMsg = "Login error: " + err.message;
  }

  googleLogin() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).catch(this.loginError);
  }

  logout() {
    this.afAuth.signOut();
  }

  ngOnInit(): void {
  }

}
