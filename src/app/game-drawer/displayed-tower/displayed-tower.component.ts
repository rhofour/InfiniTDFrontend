import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';


import { GameConfig, TowerConfig, MonsterConfig } from '../../game-config';
import { OuterUser } from '../../outer-user';
import { User } from '../../user';

@Component({
  selector: 'app-displayed-tower',
  templateUrl: './displayed-tower.component.html',
  styleUrls: ['./displayed-tower.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayedTowerComponent implements OnInit {
  @Input() displayedTower?: TowerConfig;
  @Input() user!: User;
  @Input() outerUser!: OuterUser;
  @Input() buildDisabled!: boolean;
  @Input() buildCost?: number;
  @Input() sellAmount?: number;
  @Output() build = new EventEmitter<TowerConfig>();
  @Output() sell = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
    if (this.user === undefined) {
      throw Error("Input user is undefined.");
    }
    if (this.outerUser === undefined) {
      throw Error("Input outerUser is undefined.");
    }
    if (this.buildDisabled === undefined) {
      throw Error("Input buildDisabled is undefined.");
    }
    if (this.buildCost === undefined) {
      throw Error("Input buildCost is undefined.");
    }
    if (this.sellAmount === undefined) {
      throw Error("Input sellAmount is undefined.");
    }
  }

}
