import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { MatList, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
const clone = require('rfdc')()

import { SelectionService, Selection, NewBuildSelection, GridSelection, NewMonsterSelection } from '../selection.service';
import { GameConfig, TowerConfig, MonsterConfig } from '../game-config';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { User } from '../user';
import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';
import { findShortestPaths } from '../path';

function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css'],
})
export class GameDrawerComponent {
  public selection: Selection = new Selection();
  // Only one of these should be set at once.
  public displayedTower?: TowerConfig;
  public displayedMonster?: MonsterConfig;
  public inBattle: boolean = false;
  @Input() gameConfig!: GameConfig;
  @Input() towersState: TowersBgState = { towers: [] };
  @ViewChild('buildList') buildList?: MatSelectionList;
  @ViewChild('monsterList') monsterList?: MatSelectionList;
  // user is the user we're displaying.
  @Input() user!: User;
  Math = Math;

  constructor(
    private ref: ChangeDetectorRef,
    private selectionService: SelectionService,
    private snackBar: MatSnackBar,
    public backend: BackendService,
  ) {
    selectionService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
      this.updateFromSelection(this.selection);
      this.ref.markForCheck();
    });
  }

  ngOnInit(): void {
    if (this.user === undefined) {
      throw Error("Input user is undefined.");
    }
  }

  updateFromSelection(selection: Selection) {
    this.displayedTower = undefined;
    this.displayedMonster = undefined;
    if (selection.buildTower) {
      this.displayedTower = selection.buildTower;
    } else if (this.buildList !== undefined) {
      this.buildList.deselectAll();
    }
    if (selection.gridTower) {
      this.displayedTower = selection.gridTower;
    }

    if (selection.monster) {
      this.displayedMonster = selection.monster;
    } else if (this.monsterList !== undefined) {
      this.monsterList.deselectAll();
    }
  }

  getWave(): MonsterConfig[] {
    let monsters: MonsterConfig[] = [];
    for (let monsterId of this.user.wave) {
      let monster = this.gameConfig.monsters.get(monsterId);
      if (monster !== undefined) {
        monsters.push(monster);
      } else {
        console.warn(`Unknown monster ID: ${monsterId}`);
      }
    }
    return monsters;
  }

  buildSelectionChange(event: MatSelectionListChange) {
    this.selectionService.updateSelection(new NewBuildSelection(event.option.value));
  }

  monsterSelectionChange(event: MatSelectionListChange) {
    this.selectionService.updateSelection(new NewMonsterSelection(event.option.value));
  }



  handleBackendError(actionErrDesc: string, err: Object) {
    console.warn(actionErrDesc);
    console.warn(err);
    if (hasOwnProperty(err, 'message')) {
      this.snackBar.open(`${err.message}`);
    } else {
      this.snackBar.open(`${err}`);
    }
  }

  build(loggedInUser: LoggedInUser, tower: TowerConfig, gridSel: GridSelection) {
    this.backend.build(loggedInUser, tower.id, gridSel).catch((err) => {
      this.handleBackendError("Building error:", err);
    });
  }

  sell(loggedInUser: LoggedInUser, gridSel: GridSelection) {
    this.backend.sell(loggedInUser, gridSel).catch((err) => {
      this.handleBackendError("Selling error:", err);
    });
  }

  addToWave(loggedInUser: LoggedInUser, monster: MonsterConfig) {
    this.backend.addToWave(loggedInUser, monster.id).catch((err) => {
      this.handleBackendError("Error adding to wave:", err);
    });
  }

  clearWave(loggedInUser: LoggedInUser) {
    this.backend.clearWave(loggedInUser).catch((err) => {
      this.handleBackendError("Error clearing wave:", err);
    });
  }

  wouldBlockPath(selection: GridSelection): boolean {
    // Make a deep enough copy of the state
    let possibleTowers: TowersBgState = clone(this.towersState);
    // Which tower is placed is unimportant.
    possibleTowers.towers[selection.row][selection.col] = { id: 0 };
    const paths = findShortestPaths(
      possibleTowers,
      this.gameConfig.playfield.monsterEnter,
      this.gameConfig.playfield.monsterExit);
    return paths.length === 0;
  }
}
