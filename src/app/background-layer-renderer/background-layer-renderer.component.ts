import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import Konva from 'konva';

import { CellPos } from '../types';
import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TileConfig, ConfigImageMap } from '../game-config';
import { SelectionService, GridSelection } from '../selection.service';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { findShortestPaths } from '../path';

@Component({
  selector: 'app-background-layer-renderer',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges {
  private numRows = 0;
  private numCols = 0;
  private tilesConfig!: ConfigImageMap<TileConfig>;
  private pathTiles: Int8Array = new Int8Array(0);
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

    this.numRows = this.gameConfig.playfield.numRows;
    this.numCols = this.gameConfig.playfield.numCols;
    this.pathTiles = new Int8Array(this.numRows * this.numCols);
    this.tilesConfig = this.gameConfig.tiles;
    this.updatePath();

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
    if (this.towersState === undefined || this.numCols === 0) {
      return;
    }

    this.pathTiles.fill(0);
    const paths = findShortestPaths(
      this.towersState,
      this.gameConfig.playfield.monsterEnter,
      this.gameConfig.playfield.monsterExit);
    for (const path of paths) {
      for (const cell of path) {
        this.pathTiles[cell] = 1;
      }
    }
  }

  render() {
    this.layer.destroyChildren();
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        const cellPos = new CellPos(row, col);

        var tileId;
        if (this.gameConfig.playfield.monsterEnter.equals(cellPos)) {
          tileId = this.gameConfig.playfield.pathStartId;
        } else if(this.gameConfig.playfield.monsterExit.equals(cellPos)) {
          tileId = this.gameConfig.playfield.pathEndId;
        } else if(this.pathTiles[cellPos.toNumber(this.numCols)] === 1) {
          tileId = this.gameConfig.playfield.pathId;
        } else {
          tileId = this.gameConfig.playfield.backgroundId;
        }
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
}
