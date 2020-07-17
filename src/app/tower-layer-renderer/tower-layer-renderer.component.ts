import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TowerConfig, ConfigImageMap } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { TowersState, TowerState } from '../game-state';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-tower-layer-renderer',
  template: ``,
})
export class TowerLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  private rows = 0;
  private cols = 0;
  private state!: TowersState;
  private towersConfig!: ConfigImageMap<TowerConfig>;

  constructor(
    private gameConfigService: GameConfigService,
    private gameStateService: GameStateService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    this.gameConfigService.getConfigClass().subscribe((gameConfig) => {
      this.rows = gameConfig.playfield.numRows;
      this.cols = gameConfig.playfield.numCols;
      this.towersConfig = gameConfig.towers;

      this.render();
    });

    this.gameStateService.getTowers$().subscribe((newTowerState) => {
      this.state = newTowerState;
      this.render();
    });
  }

  render() {
    if (this.state === undefined || this.towersConfig === undefined) {
      return;
    }
    this.layer.destroyChildren();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const towerId = this.state.towers[row][col]?.id;
        const towerImg = towerId === undefined ? undefined : this.towersConfig.get(towerId)?.img;
        if (towerImg) {
          let box = new Konva.Image({
              x: col * this.cellSize_,
              y: row * this.cellSize_,
              width: this.cellSize_,
              height: this.cellSize_,
              image: towerImg,
          });
          this.layer.add(box);
        }
      }
    }

    this.layer.batchDraw();
  }
}
