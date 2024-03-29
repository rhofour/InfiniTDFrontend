import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { WouldBlockPathPipe } from './would-block-path.pipe';
import { BattleLayerRendererComponent } from './battle-layer-renderer/battle-layer-renderer.component';
import { ClickShortcutDirective } from './click-shortcut.directive';
import { BattleResultsComponent } from './battle-results/battle-results.component';
import { NameTakenValidatorDirective } from './name-taken-validator';
import { DebugLogsComponent } from './debug-logs/debug-logs.component';
import { AdminComponent } from './admin/admin.component';
import { AreYouSureDialogComponent } from './are-you-sure-dialog/are-you-sure-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { GoldNumberPipe } from './gold-number.pipe';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SettingsComponent } from './settings/settings.component';
import { DisplayedTowerComponent } from './game-drawer/displayed-tower/displayed-tower.component';
import { DisplayedMonsterComponent } from './game-drawer/displayed-monster/displayed-monster.component';
import { UserBattleControlsComponent } from './game-drawer/user-battle-controls/user-battle-controls.component';
import { RivalBattleControlsComponent } from './game-drawer/rival-battle-controls/rival-battle-controls.component';

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
    WouldBlockPathPipe,
    BattleLayerRendererComponent,
    ClickShortcutDirective,
    BattleResultsComponent,
    NameTakenValidatorDirective,
    DebugLogsComponent,
    AdminComponent,
    AreYouSureDialogComponent,
    GoldNumberPipe,
    AboutComponent,
    PrivacyComponent,
    SettingsComponent,
    DisplayedTowerComponent,
    DisplayedMonsterComponent,
    UserBattleControlsComponent,
    RivalBattleControlsComponent,
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
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    DragDropModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
