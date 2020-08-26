import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

import { SelectionService, Selection, TowerSelection } from '../selection.service';
import { GameConfig, TowerConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { User } from '../user';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css']
})
export class GameDrawerComponent implements OnInit {
  public selection: Selection = new Selection(undefined, undefined);
  public displayedTower?: TowerConfig;
  public gameConfig: GameConfig = GameConfig.makeEmpty();
  public loggedInUser: User | null = null;
  @Input() towersState: TowersBgState = { towers: [] };
  @ViewChild(MatSelectionList) buildList?: MatSelectionList;
  // user is the user we're displaying.
  @Input() user: User | null = null;

  constructor(
    private selectionService: SelectionService,
    private backend: BackendService,
    gameConfigService: GameConfigService,
  ) {
    gameConfigService.getConfig().subscribe((gameConfig) => {
      this.gameConfig = gameConfig;
      this.updateFromSelection(this.selection);
    })
    selectionService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
      this.updateFromSelection(this.selection);
    });
    backend.getCurrentUser().subscribe((user) => {
      this.loggedInUser = user;
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
    this.selectionService.updateSelection(new TowerSelection(event.option.value));
  }

  ngOnInit(): void {
  }

}
