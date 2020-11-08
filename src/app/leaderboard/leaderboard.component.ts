import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';

import { User } from '../user'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent {
  users$: Observable<User[]> = EMPTY;
  displayedColumns = [ 'rank', 'name', 'accumulatedGold', 'goldPerMinute' ];
  console = console;

  constructor(
    public backend: BackendService
  ) {
    this.users$ = backend.getUsers();
  }
}
