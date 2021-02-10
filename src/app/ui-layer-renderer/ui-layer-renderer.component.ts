import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import Konva from 'konva';
import { Subscription } from 'rxjs';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { BattlegroundSelectionView } from '../battleground-selection';
import { BattlegroundState } from '../battleground-state';
import { GameConfig, TowerConfig } from '../game-config';

@Component({
  selector: 'app-ui-layer-renderer',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnChanges {
  private ringAnim: Konva.Animation | undefined = undefined;
  @Input() gameConfig!: GameConfig;
  @Input() bgState!: BattlegroundState;
  @Input() battlegroundSelection!: BattlegroundSelectionView;
  @Input() buildTower?: TowerConfig;

  constructor() { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }
    if (this.bgState === undefined) {
      throw Error("Input bgState is undefined.");
    }

    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.render();
  }

  renderSelection(row: number, col: number) {
    let selectionBox = new Konva.Rect({
        x: col * this.cellSize_,
        y: row * this.cellSize_,
        width: this.cellSize_,
        height: this.cellSize_,
        fillEnabled: false,
        stroke: 'red',
        strokeWidth: this.cellSize_ * 0.025,
    });
    this.layer.add(selectionBox);

    let rangeEffectOpacity = 0;
    let maybeSelectedTower: TowerConfig | undefined = undefined;
    let selectedTowerId = this.bgState.towers.towers[row][col]?.id;
    if (selectedTowerId !== undefined) {
      // Render range effect opaque for existing, selected towers.
      maybeSelectedTower = this.gameConfig.towers.get(selectedTowerId);
      rangeEffectOpacity = 1.0;
    } else if (this.buildTower) {
      // Render range effect transparent for potential, selected towers.
      maybeSelectedTower = this.buildTower;
      rangeEffectOpacity = 0.5;

      // Render the selected tower as transparent.
      if (maybeSelectedTower !== undefined) {
        const towerImgData = this.gameConfig.images.towers.get(maybeSelectedTower.id);
        if (towerImgData) {
          let towerImg = new Konva.Image({
              x: col * this.cellSize_,
              y: row * this.cellSize_,
              width: this.cellSize_,
              height: this.cellSize_,
              image: towerImgData,
              opacity: 0.5,
          });
          this.layer.add(towerImg);
        }
      }
    }
    if (maybeSelectedTower !== undefined && rangeEffectOpacity > 0) {
      const selectedTower : TowerConfig = maybeSelectedTower;
      let outerRangeCircle = new Konva.Circle({
        x: (col + 0.5) * this.cellSize_,
        y: (row + 0.5) * this.cellSize_,
        radius: selectedTower.range * this.cellSize_,
        fillEnabled: false,
        stroke: 'black',
        opacity: rangeEffectOpacity,
        strokeWidth: this.cellSize_ * 0.05,
        shadowEnabled: false,
      });
      this.layer.add(outerRangeCircle);
      let innerRangeCircle = new Konva.Circle({
        x: (col + 0.5) * this.cellSize_,
        y: (row + 0.5) * this.cellSize_,
        radius: selectedTower.range * this.cellSize_,
        fillEnabled: false,
        stroke: 'lime',
        opacity: rangeEffectOpacity,
        strokeWidth: this.cellSize_ * 0.025,
        shadowEnabled: false,
      });
      this.layer.add(innerRangeCircle);

      if (selectedTower.firingRate > 0) {
        const firingPeriod = 1 / selectedTower.firingRate;
        const firingDuration = selectedTower.range / selectedTower.projectileSpeed;
        const numRings = Math.ceil(firingDuration / firingPeriod);
        let rings: Konva.Circle[] = [];
        for (let i = 0; i < numRings; i++) {
          let ring = new Konva.Circle({
            x: (col + 0.5) * this.cellSize_,
            y: (row + 0.5) * this.cellSize_,
            radius: 0,
            fillEnabled: false,
            stroke: 'red',
            opacity: rangeEffectOpacity,
            strokeWidth: this.cellSize_ * 0.025,
            shadowEnabled: false,
          });
          rings.push(ring);
          this.layer.add(ring);
        }
        if (this.ringAnim) {
          this.ringAnim.stop();
        }
        this.ringAnim = new Konva.Animation(frame => {
          if (frame === undefined) {
            return;
          }
          for (let i = 0; i < numRings; i++) {
            const modTime = (-firingPeriod * i + (frame.time / 1000)) % (firingPeriod * numRings);
            const radius = modTime / firingDuration;
            if (radius > 1.0 || (frame.time / 1000) < firingPeriod * i) {
              rings[i].radius(0);
            } else {
              rings[i].radius(selectedTower.range * this.cellSize_ * radius);
            }
          }
        }, this.layer);
        this.ringAnim.start();
      }
    }
  }

  render() {
    this.layer.destroyChildren();

    const numCols = this.gameConfig.playfield.numCols;
    const numCells =  numCols * this.gameConfig.playfield.numRows;
    if (this.battlegroundSelection) {
      for (let i = 0; i < numCells; i++) {
        const row = Math.floor(i / numCols);
        const col = i % numCols;
        if (this.battlegroundSelection.isSelected(row, col)) {
          this.renderSelection(row, col);
        }
      }
    }
    this.renderSelection

    this.layer.batchDraw();
  }
}
