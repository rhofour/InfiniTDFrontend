import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { GameConfig } from '../../game-config';
import { RivalData } from '../../rivals';
import { User } from '../../user';

@Component({
  selector: 'app-rival-battle-controls',
  templateUrl: './rival-battle-controls.component.html',
  styleUrls: ['./rival-battle-controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RivalBattleControlsComponent implements OnInit {
  @Input() user!: User;
  @Input() rival!: RivalData;
  @Input() loggedIn!: boolean;
  @Input() gameConfig!: GameConfig;
  @Input() battleStateMismatch!: boolean;
  @Output() startBattle = new EventEmitter<null>();
  @Output() stopBattle = new EventEmitter<null>();
  @Output() showBattle = new EventEmitter<null>();
  @Output() showResults = new EventEmitter<null>();
  Math = Math;
  encodeURIComponent = encodeURIComponent;

  constructor() { }

  ngOnInit(): void {
    if (this.user === undefined) {
      throw Error("Input user is undefined.");
    }
    if (this.rival === undefined) {
      throw Error("Input rival is undefined.");
    }
    if (this.loggedIn === undefined) {
      throw Error("Input loggedIn is undefined.");
    }
    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }
    if (this.battleStateMismatch === undefined) {
      throw Error("Input battleStateMismatch is undefined.");
    }
  }

}
