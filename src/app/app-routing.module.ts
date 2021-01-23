import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { BattlegroundComponent } from './battleground/battleground.component';
import { AccountComponent } from './account/account.component';
import { BenchmarkComponent } from './benchmark/benchmark.component';
import { DebugLogsComponent } from './debug-logs/debug-logs.component';
import { AdminComponent } from './admin/admin.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/leaderboard', pathMatch: 'full' },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'account', component: AccountComponent },
  { path: 'battleground/:username', component: BattlegroundComponent },
  { path: 'benchmark', component: BenchmarkComponent },
  { path: 'debug/logs', component: DebugLogsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
