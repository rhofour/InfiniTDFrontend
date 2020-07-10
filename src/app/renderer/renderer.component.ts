import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import Konva from 'konva';

import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit, AfterViewInit {
  gameConfig: GameConfig;
  konvaStage: Konva.Stage | null = null;
  towersLayer!: Konva.Layer;

  constructor(
    private hostElem: ElementRef,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfig = gameConfigService.config;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let resizeObserver = new ResizeObserver(entries => {
      this.renderPlayfield();
    });
    this.setupKonva();
    resizeObserver.observe(this.hostElem.nativeElement);
  }

  setupKonva() {
    this.konvaStage = new Konva.Stage({
      container: this.hostElem.nativeElement,
      width: 0,
      height: 0,
    });
    this.towersLayer = new Konva.Layer();
    this.konvaStage.add(this.towersLayer);
  }

  renderTowers(cellSize: number) {
    console.log("cellSize: " + cellSize)
    this.towersLayer.destroyChildren();
    for (let row = 0; row < this.gameConfig.playfield.height; row++) {
      for (let col = 0; col < this.gameConfig.playfield.width; col++) {
        let i = col + row * (this.gameConfig.playfield.width + 1);
        let box = new Konva.Rect({
            x: col * cellSize,
            y: row * cellSize,
            width: cellSize,
            height: cellSize,
            fill: i % 2 == 1 ? 'black' : 'white',
            stroke: 'red',
            strokeWidth: 2,
        });
        this.towersLayer.add(box);
      }
    }

    this.towersLayer.draw();
  }

  calcCellSize(size: { width: number, height: number }) {
    let maxWidth = Math.floor(size.width / this.gameConfig.playfield.width);
    let maxHeight = Math.floor(size.height / this.gameConfig.playfield.height);
    return Math.min(maxWidth, maxHeight);
  }

  renderPlayfield() {
    if (!this.konvaStage) {
      console.warn("renderPlayfield called when konvaStage doesn't exist.");
      return;
    }
    let divSize = {
      width: this.hostElem.nativeElement.offsetWidth,
      height: this.hostElem.nativeElement.offsetHeight,
    }
    let konvaSize = this.konvaStage.size();
    let resized = false;
    let cellSize = this.calcCellSize(konvaSize);
    let divCellSize = this.calcCellSize(divSize);
    resized = cellSize !== divCellSize;
    if (resized) {
      const newSize = {
        width: divCellSize * this.gameConfig.playfield.width,
        height: divCellSize * this.gameConfig.playfield.height,
      }
      this.konvaStage.size(newSize);
      console.log("Resizing to " + newSize.width + " x " + newSize.height);
      this.renderTowers(divCellSize);
    }
  }
}
