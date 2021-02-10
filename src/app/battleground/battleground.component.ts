import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';
import { Observable, EMPTY, merge } from 'rxjs';

import { User } from '../user';
import { UserService } from '../user.service';
import { BattleState } from '../battle-state';
import { LiveBattleStateService } from '../live-battle-state.service';
import { RecordedBattleStateService } from '../recorded-battle-state.service';
import { BattlegroundState } from '../battleground-state';
import { BattlegroundStateService } from '../battleground-state.service';
import { SelectionService } from '../selection.service';
import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';


@Component({
  selector: 'app-battleground',
  templateUrl: './battleground.component.html',
  styleUrls: ['./battleground.component.css'],
  providers: [SelectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlegroundComponent implements OnInit {
  public user$: Observable<User> = EMPTY;
  public errorMsg: string | null = null;
  public battleState$: Observable<BattleState> = EMPTY;
  public battlegroundState$: Observable<BattlegroundState> = EMPTY;
  public gameConfig$: Observable<GameConfig>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private liveBattleStateService: LiveBattleStateService,
    private recordedBattleStateService: RecordedBattleStateService,
    private bgStateService: BattlegroundStateService,
    private selectionService: SelectionService,
    private gameConfigService: GameConfigService,
    private router: Router,
    public selection: SelectionService,
  ) {
    this.gameConfig$ = gameConfigService.getConfig();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.getUser();
  }

  private setError(errorMsg: string): void {
    this.errorMsg = errorMsg;
    console.warn(errorMsg);
  }

  getUser(): void {
    const username = this.route.snapshot.paramMap.get('username');

    if(username) {
      this.selectionService.setUsername(username);
      this.user$ = this.userService.getUser(username);
      this.battlegroundState$ = this.bgStateService.getBattlegroundState(username);
      const liveBattleState$ = this.liveBattleStateService.getLiveBattleState(username);
      const recordedBattleState$ = this.recordedBattleStateService.getRecordedBattleState();
      // TODO: Do a more sophisticated merging
      this.battleState$ = merge(liveBattleState$, recordedBattleState$);
    } else {
      this.setError('No username provided.');
    }
  }
}
