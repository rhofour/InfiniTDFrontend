import { Component, OnInit, Input } from '@angular/core';

import Konva from 'konva';

@Component({
  selector: 'app-base-layer-renderer',
  template: ``,
})
export abstract class BaseLayerRendererComponent implements OnInit {
  protected layer: Konva.Layer = new Konva.Layer({ listening: false });
  protected cellSize_: number = 0;
  private initialized = false;

  @Input() set cellSize(v: number) {
    this.cellSize_ = v;
    if (this.initialized) {
      this.layer.zIndex(this.zIndex);
      this.render();
    }
  }
  @Input() stage!: Konva.Stage;
  @Input() zIndex!: number;

  abstract render(): void;

  ngOnInit() {
    if (this.stage === undefined) {
      throw new Error("Input 'stage' is required.");
    }
    if (this.cellSize_ === undefined) {
      throw new Error("Input 'cellSize' is required.");
    }
    if (this.cellSize_ === undefined) {
      throw new Error("Input 'zIndex' is required.");
    }
    this.stage.add(this.layer);
    this.initialized = true;
  }

  clearRendering() {
    this.layer.destroyChildren();
  }
}
