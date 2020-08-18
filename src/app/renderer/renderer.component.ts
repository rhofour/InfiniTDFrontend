import { Component, OnInit, ElementRef, Input } from '@angular/core';
import Konva from 'konva';

import { GameConfig } from '../game-config';
import { GameConfigService } from '../game-config.service';
import { BattlegroundState } from '../battleground-state';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit {
  public cellSize: number = 0;
  public gameConfig: GameConfig = GameConfig.makeEmpty();
  public stage!: Konva.Stage;
  @Input() state: BattlegroundState | undefined;

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
    if (this.gameConfig.playfield.numRows === 0 || this.gameConfig.playfield.numCols === 0) {
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
    }
  }
}
