import { Component, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SelectionService, Selection, NewTowerSelection, GridSelection } from '../selection.service';
import { GameConfig, TowerConfig } from '../game-config';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { User } from '../user';
import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css']
})
export class GameDrawerComponent {
  public selection: Selection = new Selection(undefined, undefined);
  public displayedTower?: TowerConfig;
  @Input() gameConfig!: GameConfig;
  @Input() towersState: TowersBgState = { towers: [] };
  @ViewChild(MatSelectionList) buildList?: MatSelectionList;
  // user is the user we're displaying.
  @Input() user: User | null = null;

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
    let newlySelectedTower = undefined;
    if (selection.tower) {
      newlySelectedTower = this.gameConfig.towers.get(selection.tower.id);
    } else {
      if (this.buildList !== undefined) {
        this.buildList.deselectAll();
      }
    }
    if (selection.grid) {
      let displayedTowerId = this.towersState.towers[selection.grid.row]?.[selection.grid.col]?.id;
      if (displayedTowerId) {
        newlySelectedTower = this.gameConfig.towers.get(displayedTowerId);
      }
    }
    this.displayedTower = newlySelectedTower;
  }

  selectionChange(event: MatSelectionListChange) {
    this.selectionService.updateSelection(new NewTowerSelection(event.option.value));
  }

  build(loggedInUser: LoggedInUser, tower: TowerConfig, gridSel: GridSelection) {
    this.backend.build(loggedInUser, tower.id, gridSel).catch((err) => {
      console.warn("Building error:");
      console.warn(err);
      this.snackBar.open(err.error);
    });
  }
}
