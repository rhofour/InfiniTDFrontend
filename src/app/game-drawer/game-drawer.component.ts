import { Component, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
const clone = require('rfdc')()

import { SelectionService, Selection, NewBuildSelection, GridSelection, NewMonsterSelection } from '../selection.service';
import { GameConfig, TowerConfig, MonsterConfig } from '../game-config';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { User } from '../user';
import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';
import { findShortestPaths } from '../path';

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
  @ViewChild(MatSelectionList) buildList?: MatSelectionList;
  @ViewChild(MatSelectionList) monsterList?: MatSelectionList;
  // user is the user we're displaying.
  @Input() user: User | null = null;
  Math = Math;

  constructor(
    private selectionService: SelectionService,
    private snackBar: MatSnackBar,
    public backend: BackendService,
  ) {
    selectionService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
      this.updateFromSelection(this.selection);
    });
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
      console.log(selection.monster);
    } else if (this.monsterList !== undefined) {
      console.log(this.monsterList);
      console.log("Deselecting monsters.");
      this.monsterList.deselectAll();
    }
  }

  buildSelectionChange(event: MatSelectionListChange) {
    this.selectionService.updateSelection(new NewBuildSelection(event.option.value));
  }

  monsterSelectionChange(event: MatSelectionListChange) {
    this.selectionService.updateSelection(new NewMonsterSelection(event.option.value));
  }

  build(loggedInUser: LoggedInUser, tower: TowerConfig, gridSel: GridSelection) {
    this.backend.build(loggedInUser, tower.id, gridSel).catch((err) => {
      console.warn("Building error:");
      console.warn(err);
      this.snackBar.open(err.error);
    });
  }

  sell(loggedInUser: LoggedInUser, gridSel: GridSelection) {
    this.backend.sell(loggedInUser, gridSel).catch((err) => {
      console.warn("Selling error:");
      console.warn(err);
      this.snackBar.open(err.error);
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
