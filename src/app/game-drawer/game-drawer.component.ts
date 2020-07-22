import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

import { GameUiService, Selection, TowerSelection } from '../game-ui.service';
import { GameConfig, TowerConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { TowersState, TowerState } from '../game-state';
import { GameStateService } from '../game-state.service';
import { User } from '../user';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css']
})
export class GameDrawerComponent implements OnInit {
  public selection?: Selection;
  public selectedTower?: TowerConfig;
  public gameConfig: GameConfig = GameConfig.makeEmpty();
  public loggedInUser: User | null = null;
  private towersState: TowersState = { towers: [] };
  @ViewChild(MatSelectionList) buildList?: MatSelectionList;
  // user is the user we're displaying.
  @Input() user: User | null = null;

  constructor(
    private uiService: GameUiService,
    private backend: BackendService,
    gameConfigService: GameConfigService,
    gameStateService: GameStateService,
  ) {
    gameConfigService.getConfig().subscribe((gameConfig) => {
      this.gameConfig = gameConfig;
      this.updateFromSelection(this.selection);
    })
    uiService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
      this.updateFromSelection(this.selection);
    });
    gameStateService.getTowers$().subscribe((newTowersState) => {
      this.towersState = newTowersState;
      this.updateFromSelection(this.selection);
    });
    backend.getCurrentUser().subscribe((user) => {
      this.loggedInUser = user;
    });
  }

  updateFromSelection(selection?: Selection) {
    if (selection === undefined) {
      this.selectedTower = undefined;
      if (this.buildList !== undefined) {
        this.buildList.deselectAll();
      }
      return;
    }

    switch (selection.kind) {
      case 'grid':
        if (this.buildList !== undefined) {
          this.buildList.deselectAll();
        }
        let selectedTowerId = this.towersState.towers[selection.row][selection.col]?.id;
        if (selectedTowerId === undefined) {
          this.selectedTower = undefined;
          return;
        }

        this.selectedTower = this.gameConfig.towers.get(selectedTowerId);
        break;
      case 'tower':
        this.selectedTower = this.gameConfig.towers.get(selection.id);
        break;
      default: const _exhaustiveCheck: never = selection;
    }
  }

  selectionChange(event: MatSelectionListChange) {
    const selection : TowerSelection = { kind: 'tower', id: event.option.value };
    this.uiService.select(selection);
  }

  ngOnInit(): void {
  }

}
