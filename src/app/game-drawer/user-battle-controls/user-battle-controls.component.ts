import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { User } from '../../user';

@Component({
  selector: 'app-user-battle-controls',
  templateUrl: './user-battle-controls.component.html',
  styleUrls: ['./user-battle-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBattleControlsComponent implements OnInit {
  @Input() user!: User;
  @Input() loggedIn!: boolean;
  @Input() battleStateMismatch!: boolean;
  @Output() startBattle = new EventEmitter<null>();
  @Output() stopBattle = new EventEmitter<null>();
  @Output() showBattle = new EventEmitter<null>();
  @Output() showResults = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
    if (this.user === undefined) {
      throw Error("Input user is undefined.");
    }
    if (this.loggedIn === undefined) {
      throw Error("Input loggedIn is undefined.");
    }
    if (this.battleStateMismatch === undefined) {
      throw Error("Input battleStateMismatch is undefined.");
    }
  }

}
