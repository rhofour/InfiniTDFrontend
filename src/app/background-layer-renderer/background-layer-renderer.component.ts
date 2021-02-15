import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import Konva from 'konva';

import { CellPos } from '../types';
import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig } from '../game-config';
import { SelectionService } from '../selection.service';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { makePathMap, PathMap } from '../path';

@Component({
  selector: 'app-background-layer-renderer',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges {
  private numRows = 0;
  private numCols = 0;
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
    this.updatePath();

    // Allow the layer to listen for clicks since it will always have tiles
    // everywhere.
    this.layer.listening(true);
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.towersState) {
      this.updatePath();
    }
    this.render();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.selectionService.move(-1, 0);
      return;
    }
    if (event.key === 'ArrowDown') {
      this.selectionService.move(1, 0);
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.selectionService.move(0, -1);
      return;
    }
    if (event.key === 'ArrowRight') {
      this.selectionService.move(0, 1);
      return;
    }
  }

  updatePath() {
    if (this.towersState === undefined || this.numCols === 0) {
      return;
    }

    this.pathTiles.fill(0);
    const pathMap: PathMap | undefined = makePathMap(
      this.towersState,
      this.gameConfig.playfield.monsterEnter,
      this.gameConfig.playfield.monsterExit);
    if (pathMap === undefined) {
      console.warn("No path found.");
      return;
    }
    for (let i = 0; i < pathMap.dists.length; i++) {
      this.pathTiles[i] = pathMap.dists[i] == -1 ? 0 : 1;
    }
  }

  render() {
    this.layer.destroyChildren();
    if (this.cellSize_ === 0) {
      return;
    }
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
        const tileRawImg = this.gameConfig.images.tiles.get(tileId);

        if (tileRawImg) {
          let tileImg = new Konva.Image({
              x: col * this.cellSize_,
              y: row * this.cellSize_,
              width: this.cellSize_,
              height: this.cellSize_,
              image: tileRawImg,
          });
          tileImg.on('click tap', (evt) => {
            evt.cancelBubble = true;
            const shiftKey = evt.evt.shiftKey;
            this.selectionService.toggleBattlegroundSelection(shiftKey, row, col);
          });
          this.layer.add(tileImg);
        }
      }
    }

    this.layer.batchDraw();
  }
}
