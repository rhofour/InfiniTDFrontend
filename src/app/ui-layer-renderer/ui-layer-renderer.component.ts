import { Component, OnInit, Input } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig } from '../game-config';
import { GameUiService, Selection } from '../game-ui.service';

@Component({
  selector: 'app-ui-layer-renderer',
  template: ``,
})
export class UiLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  @Input() gameConfig!: GameConfig;
  private selection?: Selection;

  constructor(
    private uiService: GameUiService,
  ) { super(); }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw new Error("Attribute 'gameConfig' is required.");
    }
    this.uiService.getSelection().subscribe((newSelection) => {
      this.selection = newSelection;
      this.render();
    });
    this.render();
  }

  render() {
    this.layer.destroyChildren();
    if (this.selection !== undefined) {
      let selectionBox = new Konva.Rect({
          x: this.selection.col * this.cellSize_,
          y: this.selection.row * this.cellSize_,
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
