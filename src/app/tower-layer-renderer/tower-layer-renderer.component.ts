import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TowerConfig } from '../game-config';
import { TowersBgState, TowerBgState } from '../battleground-state';

@Component({
  selector: 'app-tower-layer-renderer',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TowerLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges {
  private numRows = 0;
  private numCols = 0;
  @Input() state: TowersBgState | undefined;
  @Input() gameConfig!: GameConfig;

  constructor() { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }

    this.numRows = this.gameConfig.playfield.numRows;
    this.numCols = this.gameConfig.playfield.numCols;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.state) {
      this.render();
    }
  }

  render() {
    this.layer.destroyChildren();
    if (this.state === undefined) {
      console.warn("TowerLayerRendererComponent.render called while state is undefined.");
      return;
    }
    for (let row = 0; row < this.numRows; row++) {
      let actualCols = this.state.towers[row]?.length;
      if (actualCols !== this.numCols) {
        // Exit early if our game state doesn't match our expectations.
        console.warn("On row " + row + " expected to find " + this.numCols + " cols, but instead got: " + actualCols);
        return;
      }
      for (let col = 0; col < this.numCols; col++) {
        const towerId = this.state.towers[row][col]?.id;
        const towerImg = towerId === undefined ? undefined : this.gameConfig.images.towers.get(towerId);
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
