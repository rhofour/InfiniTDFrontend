import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, EMPTY, timer, combineLatest } from 'rxjs';
import { map, expand, mergeMap } from 'rxjs/operators';

import { LoggedInUser } from '../logged-in-user';
import { User } from '../user'
import { BackendService } from '../backend.service'

const REFRESH_MS = 10000; // Refresh every 10s

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent {
  displayedColumns = [ 'rank', 'name', 'accumulatedGold', 'goldPerMinute' ];

  constructor(
    private backend: BackendService
  ) { }

  private readonly polledUsers$: Observable<User[]> =
    this.backend.getUsers().pipe(
      expand(_ => timer(REFRESH_MS).pipe(
        mergeMap(_ => this.backend.getUsers())
      ))
    );

  public readonly usersRowData$: Observable<(User & {loggedIn: boolean})[]> =
    combineLatest(this.polledUsers$, this.backend.getLoggedInUser()).pipe(
      map(([users, loggedInUser]: [User[], LoggedInUser | undefined]) =>
        users.map((user: User) =>
          Object.assign({}, user, { loggedIn: loggedInUser !== undefined && loggedInUser.matches(user) })
        )
      )
    );
}
