import { Component, OnInit, ElementRef, Input } from '@angular/core';
import Konva from 'konva';

import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { GameState, TowerState } from '../game-state';
import { UiState } from './ui-state';
import { LayerRenderer } from './layer-renderer';
import { TowerLayerRenderer } from './tower-layer-renderer';
import { UiLayerRenderer } from './ui-layer-renderer';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit {
  @Input() gameState!: GameState;
  public cellSize: number = 0;
  public gameConfig: GameConfig;
  public stage: Konva.Stage | null = null;
  towerRenderer = new TowerLayerRenderer();
  uiRenderer = new UiLayerRenderer();
  uiState: UiState;
  ready = false;

  constructor(
    private hostElem: ElementRef,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfig = gameConfigService.config;
    this.uiState = { };
  }

  ngOnInit(): void {
    let resizeObserver = new ResizeObserver(entries => {
      this.render();
    });
    this.setupKonva();
    resizeObserver.observe(this.hostElem.nativeElement);
  }

  setupKonva() {
    this.stage = new Konva.Stage({
      container: this.hostElem.nativeElement,
      width: 0,
      height: 0,
    });
    let towerReady = this.towerRenderer.init(this.gameConfig, this.stage);
    let uiReady = this.uiRenderer.init(this.gameConfig, this.stage);
    // Render when all layers are ready.
    Promise.all([towerReady, uiReady]).then(() => {
      this.ready = true;
      this.render();
    });
  }

  calcCellSize(size: { width: number, height: number }) {
    let maxWidth = Math.floor(size.width / this.gameConfig.playfield.numCols);
    let maxHeight = Math.floor(size.height / this.gameConfig.playfield.numRows);
    return Math.min(maxWidth, maxHeight);
  }

  onClick(row: number, col: number) {
    if (this.uiState.selection?.row === row && this.uiState.selection?.col === col) {
      this.uiState.selection = undefined;
    } else {
      this.uiState.selection = { row: row, col: col };
    }
    this.render();
  }

  render() {
    if (!this.stage) {
      console.warn('renderPlayfield called when stage doesn\'t exist.');
      return;
    }
    if (!this.ready) {
      console.log('Render called before it\'s ready.');
      return;
    }
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
      this.towerRenderer.render(this.gameState.towers, divCellSize);
    }
    this.uiRenderer.render(this.uiState, divCellSize);
  }
}
