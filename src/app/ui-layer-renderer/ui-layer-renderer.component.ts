import { Component, OnInit, Input } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig } from '../game-config';

@Component({
  selector: 'app-ui-layer-renderer',
  template: ``,
})
export class UiLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  @Input() gameConfig!: GameConfig;

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw new Error("Attribute 'gameConfig' is required.");
    }
    this.render();
  }

  render() {
    let selection = { row: 2, col: 1 };
    this.layer.destroyChildren();
    if (selection !== undefined) {
      let selectionBox = new Konva.Rect({
          x: selection.col * this.cellSize_,
          y: selection.row * this.cellSize_,
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
}
