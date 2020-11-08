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
  @Input() gameConfig!: GameConfig;

  constructor(
    private selectionService: SelectionService,
  ) {
    super();

    this.subscription = this.selectionService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
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
        let outerRangeCircle = new Konva.Circle({
          x: (this.selection.grid.col + 0.5) * this.cellSize_,
          y: (this.selection.grid.row + 0.5) * this.cellSize_,
          radius: this.selection.gridTower.range / 100 * this.cellSize_,
          fillEnabled: false,
          stroke: 'black',
          strokeWidth: this.cellSize_ * 0.05,
          shadowEnabled: false,
        });
        this.layer.add(outerRangeCircle);
        let innerRangeCircle = new Konva.Circle({
          x: (this.selection.grid.col + 0.5) * this.cellSize_,
          y: (this.selection.grid.row + 0.5) * this.cellSize_,
          radius: this.selection.gridTower.range / 100 * this.cellSize_,
          fillEnabled: false,
          stroke: 'lime',
          strokeWidth: this.cellSize_ * 0.025,
          shadowEnabled: false,
        });
        this.layer.add(innerRangeCircle);
      }
    }

    this.layer.batchDraw();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
