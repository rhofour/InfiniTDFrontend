import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Konva from 'konva';
import { Observable, EMPTY } from 'rxjs';

import { User } from '../user';
import { BackendService } from '../backend.service';
import { BattlegroundState } from '../battleground-state';
import { BattlegroundStateService } from '../battleground-state.service';


@Component({
  selector: 'app-towers',
  templateUrl: './towers.component.html',
  styleUrls: ['./towers.component.css']
})
export class TowersComponent implements OnInit {
  public user: User | null = null;
  public errorMsg: string | null = null;
  public battlegroundState$: Observable<BattlegroundState> = EMPTY;

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private bgStateService: BattlegroundStateService,
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
      this.backend.getUser(username)
        .then(user => {
          this.user = user;
          if (user === null) {
            this.setError('Could not find user ' + username + '.');
          }
        });
      this.battlegroundState$ = this.bgStateService.getBattlegroundState(username);
    } else {
      this.setError('No username provided.');
    }
  }
}
