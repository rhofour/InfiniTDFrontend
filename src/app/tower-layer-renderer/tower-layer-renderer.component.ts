import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TowerConfig, ConfigImageMap } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { TowersBgState, TowerBgState } from '../battleground-state';

@Component({
  selector: 'app-tower-layer-renderer',
  template: ``,
})
export class TowerLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges {
  private rows = 0;
  private cols = 0;
  private towersConfig!: ConfigImageMap<TowerConfig>;
  @Input() state: TowersBgState | undefined;
  @Input() gameConfig!: GameConfig;

  constructor(
    private gameConfigService: GameConfigService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }

    this.rows = this.gameConfig.playfield.numRows;
    this.cols = this.gameConfig.playfield.numCols;
    this.towersConfig = this.gameConfig.towers;
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
    for (let row = 0; row < this.rows; row++) {
      let actualCols = this.state.towers[row]?.length;
      if (actualCols !== this.cols) {
        // Exit early if our game state doesn't match our expectations.
        console.warn("On row " + row + " expected to find " + this.cols + " cols, but instead got: " + actualCols);
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
