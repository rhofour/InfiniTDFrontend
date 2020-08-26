import { Component, OnInit, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { Subscription } from 'rxjs';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TileConfig, ConfigImageMap } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { SelectionService, GridSelection } from '../selection.service';

@Component({
  selector: 'app-background-layer-renderer',
  template: ``,
})
export class BackgroundLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnDestroy {
  private rows = 0;
  private cols = 0;
  private tilesConfig!: ConfigImageMap<TileConfig>;
  private subscription: Subscription;

  constructor(
    private selectionService: SelectionService,
    private gameConfigService: GameConfigService,
  ) {
    super();

    this.subscription = this.gameConfigService.getConfig().subscribe((gameConfig) => {
      this.rows = gameConfig.playfield.numRows;
      this.cols = gameConfig.playfield.numCols;
      this.tilesConfig = gameConfig.tiles;
      this.render();
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

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
            this.selectionService.updateSelection(new GridSelection(row, col));
            evt.cancelBubble = true;
          });
          this.layer.add(tileImg);
        }
      }
    }

    this.layer.batchDraw();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
