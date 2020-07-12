import Konva from 'konva';
import { LayerRenderer } from './layer-renderer';

import { GameConfig } from '../game-config';
import { UiState } from './ui-state';

export class UiLayerRenderer implements LayerRenderer<UiState, GameConfig> {
  private layer = new Konva.Layer({ listening: false });
  private gameConfig!: GameConfig;

  init(gameConfig: GameConfig, stage: Konva.Stage): Promise<void> {
    this.gameConfig = gameConfig;
    stage.add(this.layer);
    return Promise.resolve();
  }

  render(uiState: UiState, cellSize: number): void {
    this.layer.destroyChildren();
    if (uiState.selection !== undefined) {
      let selectionBox = new Konva.Rect({
          x: uiState.selection.col * cellSize,
          y: uiState.selection.row * cellSize,
          width: cellSize,
          height: cellSize,
          fillEnabled: false,
          stroke: 'red',
          strokeWidth: 2,
      });
      this.layer.add(selectionBox);
    }

    this.layer.draw();
  }
}
