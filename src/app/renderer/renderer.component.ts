import { Component, OnInit, ElementRef } from '@angular/core';
import Konva from 'konva';

import { GameConfig, emptyGameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit {
  public cellSize: number = 0;
  public gameConfig: GameConfig = emptyGameConfig;
  public stage!: Konva.Stage;

  constructor(
    private hostElem: ElementRef,
    private gameConfigService: GameConfigService,
  ) { }

  ngOnInit(): void {
    this.setupKonva();

    let resizeObserver = new ResizeObserver(entries => {
      this.adjustCanvas();
    });
    resizeObserver.observe(this.hostElem.nativeElement);
    this.gameConfigService.getConfig().subscribe((config) => {
      this.gameConfig = config;
      this.adjustCanvas();
    });
  }

  setupKonva() {
    this.stage = new Konva.Stage({
      container: this.hostElem.nativeElement,
      width: 0,
      height: 0,
    });
  }

  calcCellSize(size: { width: number, height: number }) {
    let maxWidth = Math.floor(size.width / this.gameConfig.playfield.numCols);
    let maxHeight = Math.floor(size.height / this.gameConfig.playfield.numRows);
    return Math.min(maxWidth, maxHeight);
  }

  adjustCanvas() {
    let divSize = {
      width: this.hostElem.nativeElement.offsetWidth,
      height: this.hostElem.nativeElement.offsetHeight,
    }
    let konvaSize = this.stage.size();
    let resized = false;
    let divCellSize = this.calcCellSize(divSize);
    resized = this.cellSize !== divCellSize;
    if (resized) {
      this.cellSize = divCellSize;
      const newSize = {
        width: divCellSize * this.gameConfig.playfield.numCols,
        height: divCellSize * this.gameConfig.playfield.numRows,
      }
      this.stage.size(newSize);
      console.log('Resizing to ' + newSize.width + ' x ' + newSize.height);
    }
  }
}
