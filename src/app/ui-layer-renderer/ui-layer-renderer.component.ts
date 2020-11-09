import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import Konva from 'konva';
import { Subscription } from 'rxjs';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig, TowerConfig } from '../game-config';
import { SelectionService, Selection } from '../selection.service';

@Component({
  selector: 'app-ui-layer-renderer',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnDestroy {
  private selection: Selection = new Selection(undefined, undefined);
  private rows = 0;
  private cols = 0;
  private subscription: Subscription;
  private ringAnim: Konva.Animation | undefined = undefined;
  @Input() gameConfig!: GameConfig;

  constructor(
    private selectionService: SelectionService,
  ) {
    super();

    this.subscription = this.selectionService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
      if (this.ringAnim) {
        this.ringAnim.stop();
      }
      this.render();
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }

    this.render();
  }

  render() {
    this.layer.destroyChildren();

    if (this.selection.grid) {
      let selectionBox = new Konva.Rect({
          x: this.selection.grid.col * this.cellSize_,
          y: this.selection.grid.row * this.cellSize_,
          width: this.cellSize_,
          height: this.cellSize_,
          fillEnabled: false,
          stroke: 'red',
          strokeWidth: this.cellSize_ * 0.025,
      });
      this.layer.add(selectionBox);

      if (this.selection.gridTower) {
        const gridTower = this.selection.gridTower;
        let outerRangeCircle = new Konva.Circle({
          x: (this.selection.grid.col + 0.5) * this.cellSize_,
          y: (this.selection.grid.row + 0.5) * this.cellSize_,
          radius: gridTower.range * this.cellSize_,
          fillEnabled: false,
          stroke: 'black',
          strokeWidth: this.cellSize_ * 0.05,
          shadowEnabled: false,
        });
        this.layer.add(outerRangeCircle);
        let innerRangeCircle = new Konva.Circle({
          x: (this.selection.grid.col + 0.5) * this.cellSize_,
          y: (this.selection.grid.row + 0.5) * this.cellSize_,
          radius: gridTower.range * this.cellSize_,
          fillEnabled: false,
          stroke: 'lime',
          strokeWidth: this.cellSize_ * 0.025,
          shadowEnabled: false,
        });
        this.layer.add(innerRangeCircle);

        if (gridTower.firingRate > 0) {
          const firingPeriod = 1 / gridTower.firingRate;
          const firingDuration = gridTower.range / gridTower.projectileSpeed;
          const numRings = Math.ceil(firingDuration / firingPeriod);
          let rings: Konva.Circle[] = [];
          for (let i = 0; i < numRings; i++) {
            let ring = new Konva.Circle({
              x: (this.selection.grid.col + 0.5) * this.cellSize_,
              y: (this.selection.grid.row + 0.5) * this.cellSize_,
              radius: 0,
              fillEnabled: false,
              stroke: 'red',
              strokeWidth: this.cellSize_ * 0.025,
              shadowEnabled: false,
            });
            rings.push(ring);
            this.layer.add(ring);
          }
          if (this.ringAnim) {
            this.ringAnim.stop();
          }
          this.ringAnim = new Konva.Animation((frame: any | undefined) => {
            if (frame === undefined) {
              return;
            }
            for (let i = 0; i < numRings; i++) {
              const modTime = (-firingPeriod * i + (frame.time / 1000)) % (firingPeriod * numRings);
              const radius = modTime / firingDuration;
              if (radius > 1.0 || (frame.time / 1000) < firingPeriod * i) {
                rings[i].radius(0);
              } else {
                rings[i].radius(gridTower.range * this.cellSize_ * radius);
              }
            }
          }, this.layer);
          this.ringAnim.start();
        }
      }
    }

    this.layer.batchDraw();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
