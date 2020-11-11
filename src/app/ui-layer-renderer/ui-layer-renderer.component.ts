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

      let rangeEffectOpacity = 0;
      let selectedTower: TowerConfig | undefined = undefined;
      if (this.selection.gridTower) {
        selectedTower = this.selection.gridTower;
        rangeEffectOpacity = 1.0;
      } else if (this.selection.buildTower) {
        selectedTower = this.selection.buildTower;
        rangeEffectOpacity = 0.5;
      }
      if (selectedTower !== undefined && this.selection.grid !== undefined &&
          rangeEffectOpacity > 0) {
        let outerRangeCircle = new Konva.Circle({
          x: (this.selection.grid.col + 0.5) * this.cellSize_,
          y: (this.selection.grid.row + 0.5) * this.cellSize_,
          radius: selectedTower.range * this.cellSize_,
          fillEnabled: false,
          stroke: 'black',
          opacity: rangeEffectOpacity,
          strokeWidth: this.cellSize_ * 0.05,
          shadowEnabled: false,
        });
        this.layer.add(outerRangeCircle);
        let innerRangeCircle = new Konva.Circle({
          x: (this.selection.grid.col + 0.5) * this.cellSize_,
          y: (this.selection.grid.row + 0.5) * this.cellSize_,
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
              x: (this.selection.grid.col + 0.5) * this.cellSize_,
              y: (this.selection.grid.row + 0.5) * this.cellSize_,
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
          // Without this TS thinks selectedTower could be undefined in the
          // animation function.
          const definedSelectedTower: TowerConfig = selectedTower;
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
                rings[i].radius(definedSelectedTower.range * this.cellSize_ * radius);
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
