import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';
import { Observable, EMPTY } from 'rxjs';

import { User } from '../user';
import { UserService } from '../user.service';
import { BattleState } from '../battle-state';
import { BattleStateService } from '../battle-state.service';
import { BattlegroundState } from '../battleground-state';
import { BattlegroundStateService } from '../battleground-state.service';
import { SelectionService } from '../selection.service';
import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';


@Component({
  selector: 'app-battleground',
  templateUrl: './battleground.component.html',
  styleUrls: ['./battleground.component.css'],
  providers: [SelectionService]
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
    private battleStateService: BattleStateService,
    private bgStateService: BattlegroundStateService,
    private selectionService: SelectionService,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfig$ = gameConfigService.getConfig();
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
      this.battleState$ = this.battleStateService.getBattleState(username);
    } else {
      this.setError('No username provided.');
    }
  }
}
