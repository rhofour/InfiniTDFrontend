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
      this.render();
    }
  }
  @Input() stage!: Konva.Stage;

  abstract render(): void;

  ngOnInit() {
    if (this.stage === undefined) {
      throw new Error("Attribute 'stage' is required.");
    }
    if (this.cellSize_ === undefined) {
      throw new Error("Attribute 'cellSize' is required.");
    }
    this.stage.add(this.layer);
    this.initialized = true;
  }
}
