import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { BattlegroundComponent } from './battleground/battleground.component';
import { AccountComponent } from './account/account.component';
import { BenchmarkComponent } from './benchmark/benchmark.component';
import { DebugLogsComponent } from './debug-logs/debug-logs.component';

const routes: Routes = [
  { path: '', redirectTo: '/leaderboard', pathMatch: 'full' },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'account', component: AccountComponent },
  { path: 'battleground/:username', component: BattlegroundComponent },
  { path: 'benchmark', component: BenchmarkComponent },
  { path: 'debug/logs', component: DebugLogsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
