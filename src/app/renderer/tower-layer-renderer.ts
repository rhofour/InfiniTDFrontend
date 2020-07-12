import Konva from 'konva';
import { LayerRenderer } from './layer-renderer';

import { GameConfig } from '../game-config';
import { TowersState, TowerState } from '../game-state';

export class TowerLayerRenderer implements LayerRenderer<TowersState, GameConfig> {
  private layer = new Konva.Layer({ listening: false });
  private gameConfig!: GameConfig;

  init(gameConfig: GameConfig, stage: Konva.Stage): Promise<void> {
    this.gameConfig = gameConfig;
    stage.add(this.layer);
    return Promise.resolve();
  }

  render(towersState: TowersState, cellSize: number): void {
    console.log(towersState);
    this.layer.destroyChildren();
    const padding = Math.floor(cellSize / 4);
    for (let row = 0; row < this.gameConfig.playfield.numRows; row++) {
      for (let col = 0; col < this.gameConfig.playfield.numCols; col++) {
        const tower: TowerState = towersState.towers[row][col];
        let box = new Konva.Rect({
            x: col * cellSize + padding,
            y: row * cellSize + padding,
            width: cellSize - (2 * padding),
            height: cellSize - (2 * padding),
            fill: tower.id == 1 ? 'black' : 'white',
            strokeWidth: 0,
        });
        this.layer.add(box);
      }
    }

    this.layer.draw();
  }
}
