import { Component, OnInit } from '@angular/core';

import { GameUiService, Selection } from '../game-ui.service';
import { GameConfigData, TowerConfig, emptyGameConfigData } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { TowersState, TowerState } from '../game-state';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css']
})
export class GameDrawerComponent implements OnInit {
  public selection?: Selection;
  public selectedTower?: TowerConfig;
  private gameConfig: GameConfigData = emptyGameConfigData;
  private towersState: TowersState = { towers: [] };

  constructor(
    uiService: GameUiService,
    gameConfigService: GameConfigService,
    gameStateService: GameStateService,
  ) {
    gameConfigService.getConfigData().subscribe((gameConfig) => {
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
  }

  updateFromSelection(selection?: Selection) {
    if (selection === undefined) {
      return;
    }

    let selectedTowerId = this.towersState.towers[selection.row][selection.col]?.id;
    if (selectedTowerId === undefined) {
      return;
    }

    console.log("Selected tower ID: " + selectedTowerId);
  }

  ngOnInit(): void {
  }

}
