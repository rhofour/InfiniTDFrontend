import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import Konva from 'konva';

import { GameConfig } from '../game-config';
import { BattlegroundState } from '../battleground-state';
import { BattleState } from '../battle-state';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RendererComponent implements OnInit, AfterViewInit {
  public cellSize: number = 0;
  public stage!: Konva.Stage;
  @Input() state!: BattlegroundState;
  @Input() battleState!: BattleState;
  @Input() gameConfig!: GameConfig;

  constructor(
    private hostElem: ElementRef,
    private cdRef: ChangeDetectorRef,
    public selection: SelectionService,
  ) { }

  ngOnInit(): void {
    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }
    if (this.state === undefined) {
      throw Error("Input state is undefined.");
    }
    this.setupKonva();
  }

  ngAfterViewInit(): void {
    let resizeObserver = new ResizeObserver(entries => {
      this.adjustCanvas();
    });
    resizeObserver.observe(this.hostElem.nativeElement);
    this.adjustCanvas();
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
      console.warn('adjustCanvas called with empty game config:');
      console.warn(this.gameConfig);
      return;
    }
    let divSize = {
      width: this.hostElem.nativeElement.offsetWidth,
      height: this.hostElem.nativeElement.offsetHeight,
    }
    let konvaSize = this.stage.size();
    let divCellSize = this.calcCellSize(divSize);
    const resized = this.cellSize !== divCellSize;
    if (resized) {
      this.cellSize = divCellSize;
      const newSize = {
        width: divCellSize * this.gameConfig.playfield.numCols,
        height: divCellSize * this.gameConfig.playfield.numRows,
      }
      this.stage.size(newSize);
      this.cdRef.detectChanges();
    }
  }
}
