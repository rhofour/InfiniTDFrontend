import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';

import { GameUiService, Selection, TowerSelection } from '../game-ui.service';
import { GameConfig, TowerConfig, ConfigImagePair } from '../game-config';
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
  public selectedTower?: ConfigImagePair<TowerConfig>;
  public gameConfig: GameConfig = GameConfig.makeEmpty();
  private towersState: TowersState = { towers: [] };
  @ViewChild(MatSelectionList) buildList?: MatSelectionList;

  constructor(
    private uiService: GameUiService,
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
