import Konva from 'konva';
import { LayerRenderer } from './layer-renderer';

import { GameConfig } from '../game-config';
import { TowersState, TowerState } from '../game-state';

export class TowerLayerRenderer implements LayerRenderer<TowersState, GameConfig> {
  private layer = new Konva.Layer();
  private gameConfig!: GameConfig;

  init(gameConfig: GameConfig, stage: Konva.Stage) {
    this.gameConfig = gameConfig;
    stage.add(this.layer);
  }

  render(towersState: TowersState, cellSize: number): void {
    console.log(towersState);
    this.layer.destroyChildren();
    for (let row = 0; row < this.gameConfig.playfield.numRows; row++) {
      for (let col = 0; col < this.gameConfig.playfield.numCols; col++) {
        const tower: TowerState = towersState.towers[row][col];
        let box = new Konva.Rect({
            x: col * cellSize,
            y: row * cellSize,
            width: cellSize,
            height: cellSize,
            fill: tower.id == 1 ? 'black' : 'white',
            stroke: 'red',
            strokeWidth: 2,
        });
        this.layer.add(box);
      }
    }

    this.layer.draw();
  }
}
