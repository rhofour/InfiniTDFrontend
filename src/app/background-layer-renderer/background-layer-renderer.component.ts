import { Component, OnInit, Input } from '@angular/core';
import Konva from 'konva';

import { BaseLayerRendererComponent } from '../base-layer-renderer/base-layer-renderer.component';
import { GameConfig } from '../game-config';
import { BackgroundState } from '../game-state';

@Component({
  selector: 'app-background-layer-renderer',
  template: ``,
})
export class BackgroundLayerRendererComponent extends BaseLayerRendererComponent implements OnInit {
  @Input() gameConfig!: GameConfig;
  // TODO(rofer): Replace this with a game state service.
  @Input() backgroundState!: BackgroundState;
  private images = new Map();

  ngOnInit(): void {
    super.ngOnInit();

    if (this.gameConfig === undefined) {
      throw new Error("Attribute 'gameConfig' is required.");
    }
    if (this.backgroundState === undefined) {
      throw new Error("Attribute 'backgroundState' is required.");
    }

    // Load the background images.
    let promises: Promise<void>[] = [];
    for (let tile of this.gameConfig.tiles) {
      let img = new Image();
      this.images.set(tile.id, img);
      let loadPromise: Promise<void> = new Promise((resolve, reject) => {
        img.onload = () => resolve();
      });
      img.src = tile.url;
      promises.push(loadPromise);
    }
    this.stage.add(this.layer);
    // Render once everything is loaded.
    Promise.all(promises).then(() => this.render());
  }

  render() {
    console.log(this);
    this.layer.destroyChildren();
    console.log(this.backgroundState);
    for (let row = 0; row < this.gameConfig.playfield.numRows; row++) {
      for (let col = 0; col < this.gameConfig.playfield.numCols; col++) {
        const tileId = this.backgroundState.ids[row][col];
        let tileImg = new Konva.Image({
            x: col * this.cellSize_,
            y: row * this.cellSize_,
            width: this.cellSize_,
            height: this.cellSize_,
            image: this.images.get(tileId),
        });
        // TODO(rofer): Replace this with communicating with a UI service.
        // tileImg.on('click', (evt) => {
        //   this.clickCallback(row, col);
        //   evt.cancelBubble = true;
        // });
        this.layer.add(tileImg);
      }
    }

    this.layer.batchDraw();
  }
}
