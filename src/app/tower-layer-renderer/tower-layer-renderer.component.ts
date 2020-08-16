import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TowerConfig, ConfigImageMap } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { TowersBgState, TowerBgState } from '../battleground-state';

@Component({
  selector: 'app-tower-layer-renderer',
  template: ``,
})
export class TowerLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  private rows = 0;
  private cols = 0;
  private state!: TowersBgState;
  private towersConfig!: ConfigImageMap<TowerConfig>;

  constructor(
    private gameConfigService: GameConfigService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    this.gameConfigService.getConfig().subscribe((gameConfig) => {
      this.rows = gameConfig.playfield.numRows;
      this.cols = gameConfig.playfield.numCols;
      this.towersConfig = gameConfig.towers;
    });
  }

  render() {
    this.layer.destroyChildren();
    if (this.state === undefined) return;
    for (let row = 0; row < this.rows; row++) {
      if (this.state.towers[row].length !== this.cols) {
        // Exit early if our game state doesn't match our expectations.
        return;
      }
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