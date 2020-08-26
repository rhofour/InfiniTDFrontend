import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';
import { Observable, EMPTY } from 'rxjs';

import { User } from '../user';
import { UserService } from '../user.service';
import { BattlegroundState } from '../battleground-state';
import { BattlegroundStateService } from '../battleground-state.service';
import { SelectionService } from '../selection.service';


@Component({
  selector: 'app-battleground',
  templateUrl: './battleground.component.html',
  styleUrls: ['./battleground.component.css'],
  providers: [SelectionService]
})
export class BattlegroundComponent implements OnInit {
  public user$: Observable<User> = EMPTY;
  public errorMsg: string | null = null;
  public battlegroundState$: Observable<BattlegroundState> = EMPTY;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private bgStateService: BattlegroundStateService,
    private selectionService: SelectionService,
  ) { }

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
    } else {
      this.setError('No username provided.');
    }
  }
}
