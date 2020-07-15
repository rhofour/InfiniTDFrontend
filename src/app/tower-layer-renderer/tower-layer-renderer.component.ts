import { Component, OnInit, Input } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig } from '../game-config';
import { TowersState, TowerState } from '../game-state';

@Component({
  selector: 'app-tower-layer-renderer',
  template: ``,
})
export class TowerLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  @Input() gameConfig!: GameConfig;
  // TODO(rofer): Replace this with a game state service.
  @Input() towersState!: TowersState;
  private images = new Map();

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw new Error("Attribute 'gameConfig' is required.");
    }
    if (this.towersState === undefined) {
      throw new Error("Attribute 'towersState' is required.");
    }

    // Load the tower images.
    let promises: Promise<void>[] = [];
    for (let tile of this.gameConfig.towers) {
      let img = new Image();
      this.images.set(tile.id, img);
      let loadPromise: Promise<void> = new Promise((resolve, reject) => {
        img.onload = () => resolve();
      });
      img.src = tile.url;
      promises.push(loadPromise);
    }

    // Render once everything is loaded.
    Promise.all(promises).then(() => this.render());
  }

  render() {
    this.layer.destroyChildren();
    for (let row = 0; row < this.gameConfig.playfield.numRows; row++) {
      for (let col = 0; col < this.gameConfig.playfield.numCols; col++) {
        const tower: TowerState | null = this.towersState.towers[row][col];
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
