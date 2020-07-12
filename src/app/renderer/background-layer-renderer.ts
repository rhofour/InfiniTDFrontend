import Konva from 'konva';
import { LayerRenderer } from './layer-renderer';

import { GameConfig } from '../game-config';
import { BackgroundState } from '../game-state';

export class BackgroundLayerRenderer implements LayerRenderer<BackgroundState, GameConfig> {
  private layer = new Konva.Layer({ listening: true });
  private gameConfig!: GameConfig;
  private images = new Map();
  private clickCallback: (row: number, col: number) => void;

  constructor(clickCallback: (row: number, col: number) => void) {
    this.clickCallback = clickCallback;
  }

  init(gameConfig: GameConfig, stage: Konva.Stage): Promise<void>  {
    this.gameConfig = gameConfig;
    // Load the background images.
    let promises: Promise<void>[] = [];
    for (let tile of gameConfig.tiles) {
      let img = new Image();
      this.images.set(tile.id, img);
      let loadPromise: Promise<void> = new Promise((resolve, reject) => {
        img.onload = () => resolve();
      });
      img.src = tile.url;
      promises.push(loadPromise);
    }
    stage.add(this.layer);
    return Promise.all(promises).then(() => { return; });
  }

  render(backgroundState: BackgroundState, cellSize: number): void {
    this.layer.destroyChildren();
    for (let row = 0; row < this.gameConfig.playfield.numRows; row++) {
      for (let col = 0; col < this.gameConfig.playfield.numCols; col++) {
        const tileId = backgroundState.ids[row][col];
        let tileImg = new Konva.Image({
            x: col * cellSize,
            y: row * cellSize,
            width: cellSize,
            height: cellSize,
            image: this.images.get(tileId),
        });
        tileImg.on('click', (evt) => {
          this.clickCallback(row, col);
          evt.cancelBubble = true;
        });
        this.layer.add(tileImg);
      }
    }

    this.layer.draw();
  }
}
