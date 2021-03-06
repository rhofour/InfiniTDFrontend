import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, EMPTY, timer, combineLatest } from 'rxjs';
import { map, expand, mergeMap } from 'rxjs/operators';

import { OuterUser } from '../outer-user';
import { User } from '../user'
import { BackendService } from '../backend.service'

const REFRESH_MS = 5000; // Refresh every 5s

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent {
  displayedColumns = [ 'rank', 'name', 'accumulatedGold', 'goldPerMinute', 'battleStatus' ];
  encodeURIComponent = encodeURIComponent;

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
    combineLatest([this.polledUsers$, this.backend.getOuterUser()]).pipe(
      map(([users, loggedInUser]: [User[], OuterUser | undefined]) =>
        users
          .filter(user => user.goldPerMinute > 0)
          .map((user: User) =>
            Object.assign({}, user, { loggedIn: loggedInUser !== undefined && loggedInUser.matches(user) })
          )
      )
    );
}
