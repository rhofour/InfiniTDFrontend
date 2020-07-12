import { Component, OnInit, ElementRef, AfterViewInit, Input } from '@angular/core';
import Konva from 'konva';

import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { GameState, TowerState } from '../game-state';
import { UiState } from './ui-state';
import { LayerRenderer } from './layer-renderer';
import { BackgroundLayerRenderer } from './background-layer-renderer';
import { TowerLayerRenderer } from './tower-layer-renderer';
import { UiLayerRenderer } from './ui-layer-renderer';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit, AfterViewInit {
  @Input() gameState!: GameState;
  gameConfig: GameConfig;
  konvaStage: Konva.Stage | null = null;
  backgroundRenderer = new BackgroundLayerRenderer((row, col) => this.onClick(row, col));
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
  }

  ngAfterViewInit() {
    let resizeObserver = new ResizeObserver(entries => {
      this.render();
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
    let backgroundReady = this.backgroundRenderer.init(this.gameConfig, this.konvaStage);
    let towerReady = this.towerRenderer.init(this.gameConfig, this.konvaStage);
    let uiReady = this.uiRenderer.init(this.gameConfig, this.konvaStage);
    // Render when all layers are ready.
    Promise.all([towerReady, backgroundReady, uiReady]).then(() => {
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
    if (!this.konvaStage) {
      console.warn('renderPlayfield called when konvaStage doesn\'t exist.');
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
    let konvaSize = this.konvaStage.size();
    let resized = false;
    let cellSize = this.calcCellSize(konvaSize);
    let divCellSize = this.calcCellSize(divSize);
    resized = cellSize !== divCellSize;
    if (resized) {
      const newSize = {
        width: divCellSize * this.gameConfig.playfield.numCols,
        height: divCellSize * this.gameConfig.playfield.numRows,
      }
      this.konvaStage.size(newSize);
      console.log('Resizing to ' + newSize.width + ' x ' + newSize.height);
      this.backgroundRenderer.render(this.gameState.background, divCellSize);
      this.towerRenderer.render(this.gameState.towers, divCellSize);
    }
    this.uiRenderer.render(this.uiState, divCellSize);
  }
}
