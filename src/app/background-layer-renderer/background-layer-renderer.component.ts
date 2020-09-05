import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import Konva from 'konva';

import { CellPos } from '../types';
import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TileConfig, ConfigImageMap } from '../game-config';
import { SelectionService, GridSelection } from '../selection.service';
import { TowersBgState, TowerBgState } from '../battleground-state';

@Component({
  selector: 'app-background-layer-renderer',
  template: ``,
})
export class BackgroundLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges {
  private rows = 0;
  private cols = 0;
  private tilesConfig!: ConfigImageMap<TileConfig>;
  private pathTiles: Set<string> = new Set(['0_0', '1_0']);
  @Input() towersState: TowersBgState | undefined;
  @Input() gameConfig!: GameConfig;

  constructor(
    private selectionService: SelectionService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }

    this.rows = this.gameConfig.playfield.numRows;
    this.cols = this.gameConfig.playfield.numCols;
    this.tilesConfig = this.gameConfig.tiles;

    // Allow the layer to listen for clicks since it will always have tiles
    // everywhere.
    this.layer.listening(true);
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.towersState) {
      this.updatePath();
      this.render();
    }
  }

  updatePath() {
    return;
  }

  render() {
    console.log(this.pathTiles);
    this.layer.destroyChildren();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tileId = this.pathTiles.has(row + '_' + col) ? 1 : 0;
        const tile = this.tilesConfig.get(tileId);
        //console.log('row ' + row + ' col ' + col + ' = ' + tileId);

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
}
