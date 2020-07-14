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

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw new Error("Attribute 'gameConfig' is required.");
    }
    if (this.towersState === undefined) {
      throw new Error("Attribute 'towersState' is required.");
    }
    this.render();
  }

  render() {
    this.layer.destroyChildren();
    const padding = Math.floor(this.cellSize_ / 4);
    for (let row = 0; row < this.gameConfig.playfield.numRows; row++) {
      for (let col = 0; col < this.gameConfig.playfield.numCols; col++) {
        const tower: TowerState | null = this.towersState.towers[row][col];
        if (tower) {
          let box = new Konva.Rect({
              x: col * this.cellSize_ + padding,
              y: row * this.cellSize_ + padding,
              width: this.cellSize_ - (2 * padding),
              height: this.cellSize_ - (2 * padding),
              fill: tower.id == 1 ? 'black' : 'white',
              strokeWidth: 0,
          });
          this.layer.add(box);
        }
      }
    }

    this.layer.batchDraw();
  }
}
