import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

import { GameUiService, Selection, TowerSelection } from '../game-ui.service';
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
  public selectedTower?: TowerConfig;
  public gameConfig: GameConfig = GameConfig.makeEmpty();
  public loggedInUser: User | null = null;
  @Input() towersState: TowersBgState = { towers: [] };
  @ViewChild(MatSelectionList) buildList?: MatSelectionList;
  // user is the user we're displaying.
  @Input() user: User | null = null;

  constructor(
    private uiService: GameUiService,
    private backend: BackendService,
    gameConfigService: GameConfigService,
  ) {
    gameConfigService.getConfig().subscribe((gameConfig) => {
      this.gameConfig = gameConfig;
      this.updateFromSelection(this.selection);
    })
    uiService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
      this.updateFromSelection(this.selection);
    });
    backend.getCurrentUser().subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  updateFromSelection(selection: Selection) {
    let newSelectedTowerId = undefined;
    if (selection.grid) {
      let selectedTowerId = this.towersState.towers[selection.grid.row]?.[selection.grid.col]?.id;
      if (selectedTowerId) {
        // If the grid selection points to a tower then ignore tower selection.
        if (this.buildList !== undefined) {
          this.buildList.deselectAll();
        }
        this.selectedTower = this.gameConfig.towers.get(selectedTowerId);
        return;
      }
    }
    if (selection.tower) {
      this.selectedTower = this.gameConfig.towers.get(selection.tower.id);
      return;
    }
    this.selectedTower = undefined;
  }

  selectionChange(event: MatSelectionListChange) {
    const selection = new Selection(new TowerSelection(event.option.value), undefined);
    this.uiService.select(selection);
  }

  ngOnInit(): void {
  }

}
