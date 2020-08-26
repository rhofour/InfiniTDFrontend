import { Component, OnInit, OnDestroy } from '@angular/core';
import Konva from 'konva';
import { Subscription } from 'rxjs';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { SelectionService, Selection } from '../selection.service';

@Component({
  selector: 'app-ui-layer-renderer',
  template: ``,
})
export class UiLayerRendererComponent extends BaseLayerRendererComponent implements OnInit, OnDestroy {
  private selection: Selection = new Selection(undefined, undefined);
  private rows = 0;
  private cols = 0;
  private subscription: Subscription;

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
          strokeWidth: 2,
      });
      this.layer.add(selectionBox);
    }

    this.layer.batchDraw();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
