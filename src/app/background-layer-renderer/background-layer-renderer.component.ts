import { Component, OnInit } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TileConfig, ConfigImageMap } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { GameUiService, Selection, GridSelection } from '../game-ui.service';

@Component({
  selector: 'app-background-layer-renderer',
  template: ``,
})
export class BackgroundLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  private rows = 0;
  private cols = 0;
  private tilesConfig!: ConfigImageMap<TileConfig>;

  constructor(
    private uiService: GameUiService,
    private gameConfigService: GameConfigService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    this.gameConfigService.getConfig().subscribe((gameConfig) => {
      this.rows = gameConfig.playfield.numRows;
      this.cols = gameConfig.playfield.numCols;
      this.tilesConfig = gameConfig.tiles;
      this.render();
    });

    // Allow the layer to listen for clicks since it will always have tiles
    // everywhere.
    this.layer.listening(true);
  }

  render() {
    if (this.tilesConfig === undefined)
      return;
    this.layer.destroyChildren();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tileId = 0; // Later replace with background / path logic.
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
            const selection: Selection = { grid: new GridSelection(row, col), tower: undefined }
            this.uiService.select(selection);
            evt.cancelBubble = true;
          });
          this.layer.add(tileImg);
        }
      }
    }

    this.layer.batchDraw();
  }
}
