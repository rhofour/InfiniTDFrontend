import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UserFieldComponent } from './user-field/user-field.component';
import { environment } from '../environments/environment';
import { firebase } from './firebase';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LeaderboardComponent,
    TopBarComponent,
    UserFieldComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebase),
    AngularFireAuthModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
