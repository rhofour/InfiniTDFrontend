import { Component, OnInit, Input } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TowerConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { TowersState, TowerState } from '../game-state';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-tower-layer-renderer',
  template: ``,
})
export class TowerLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  private images = new Map();
  private state!: TowersState;
  private rows = 0;
  private cols = 0;
  private towersConfig: TowerConfig[] = [];

  constructor(
    private gameConfigService: GameConfigService,
    private gameStateService: GameStateService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    this.gameConfigService.getConfig().subscribe((gameConfig) => {
      this.rows = gameConfig.playfield.numRows;
      this.cols = gameConfig.playfield.numCols;
      this.towersConfig = gameConfig.towers;

      this.loadTowers(this.towersConfig);
    });

    this.gameStateService.getTowers$().subscribe((newTowerState) => {
      this.state = newTowerState;
      this.render();
    });
  }

  loadTowers(towersConfig: TowerConfig[]) {
    // Reset the map.
    this.images = new Map();

    // Load the background images.
    let promises: Promise<void>[] = [];
    for (let tower of towersConfig) {
      let img = new Image();
      this.images.set(tower.id, img);
      let loadPromise: Promise<void> = new Promise((resolve, reject) => {
        img.onload = () => resolve();
      });
      img.src = tower.url;
      promises.push(loadPromise);
    }

    // Render once everything is loaded.
    Promise.all(promises).then(() => this.render());
  }

  render() {
    if (this.state === undefined) {
      return;
    }
    this.layer.destroyChildren();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tower: TowerState | null = this.state.towers[row][col];
        if (tower) {
          let box = new Konva.Image({
              x: col * this.cellSize_,
              y: row * this.cellSize_,
              width: this.cellSize_,
              height: this.cellSize_,
              image: this.images.get(tower.id),
          });
          this.layer.add(box);
        }
      }
    }

    this.layer.batchDraw();
  }
}
