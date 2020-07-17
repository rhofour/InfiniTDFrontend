import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TileConfig, ConfigImageMap } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { BackgroundState } from '../game-state';
import { GameStateService } from '../game-state.service';
import { GameUiService } from '../game-ui.service';

@Component({
  selector: 'app-background-layer-renderer',
  template: ``,
})
export class BackgroundLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  private rows = 0;
  private cols = 0;
  private state!: BackgroundState;
  private tilesConfig!: ConfigImageMap<TileConfig>;

  constructor(
    private uiService: GameUiService,
    private gameConfigService: GameConfigService,
    private gameStateService: GameStateService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    this.gameConfigService.getConfigClass().subscribe((gameConfig) => {
      this.rows = gameConfig.playfield.numRows;
      this.cols = gameConfig.playfield.numCols;
      this.tilesConfig = gameConfig.tiles;

      this.render();
    });

    this.gameStateService.getBackground$().subscribe((newBgState) => {
      this.state = newBgState;
      this.render();
    });

    // Allow the layer to listen for clicks.
    this.layer.listening(true);
  }

  render() {
    if (this.state === undefined || this.tilesConfig === undefined) {
      return;
    }
    this.layer.destroyChildren();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tileId = this.state.ids[row][col];
        const tile = this.tilesConfig.get(tileId);

        if (tile) {
          let tileImg = new Konva.Image({
              x: col * this.cellSize_,
              y: row * this.cellSize_,
              width: this.cellSize_,
              height: this.cellSize_,
              image: tile.img,
          });
          tileImg.on('click', (evt) => {
            this.uiService.select({row: row, col: col});
            evt.cancelBubble = true;
          });
          this.layer.add(tileImg);
        }
      }
    }

    this.layer.batchDraw();
  }
}
