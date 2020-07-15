import { Component, OnInit, Input } from '@angular/core';

import { GameUiService, Selection } from '../game-ui.service';
import { TowerConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css']
})
export class GameDrawerComponent implements OnInit {
  public selection?: Selection;
  public selectedTower?: TowerConfig;

  constructor(
    uiService: GameUiService,
    gameConfigService: GameConfigService,
    gameStateService: GameStateService,
  ) {
    uiService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
    });
  }

  ngOnInit(): void {
  }

}
