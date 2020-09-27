import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { BattlegroundComponent } from './battleground/battleground.component';
import { environment } from '../environments/environment';
import { firebase } from './firebase';
import { AccountComponent } from './account/account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RendererComponent } from './renderer/renderer.component';
import { BaseLayerRendererComponent } from './base-layer-renderer/base-layer-renderer.component';
import { BackgroundLayerRendererComponent } from './background-layer-renderer/background-layer-renderer.component';
import { TowerLayerRendererComponent } from './tower-layer-renderer/tower-layer-renderer.component';
import { UiLayerRendererComponent } from './ui-layer-renderer/ui-layer-renderer.component';
import { GameDrawerComponent } from './game-drawer/game-drawer.component';
import { BenchmarkComponent } from './benchmark/benchmark.component';

@NgModule({
  declarations: [
    AppComponent,
    LeaderboardComponent,
    TopBarComponent,
    BattlegroundComponent,
    AccountComponent,
    RendererComponent,
    BackgroundLayerRendererComponent,
    TowerLayerRendererComponent,
    UiLayerRendererComponent,
    GameDrawerComponent,
    BenchmarkComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebase),
    AngularFireAuthModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatSnackBarModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
