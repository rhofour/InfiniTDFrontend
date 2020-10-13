import { Component, OnInit, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, AfterViewInit } from '@angular/core';
import Konva from 'konva';

import { GameConfig } from '../game-config';
import { BattlegroundState } from '../battleground-state';
import { BattleState } from '../battle-state';
import { DebugService } from '../debug.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RendererComponent implements OnInit, AfterViewInit {
  public cellSize: number = 0;
  public stage!: Konva.Stage;
  @Input() state: BattlegroundState | undefined;
  @Input() battleState!: BattleState;
  @Input() gameConfig!: GameConfig;

  constructor(
    private hostElem: ElementRef,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private debug: DebugService,
  ) {
    debug.reset();
    this.debug.add('Renderer constructed.')
  }

  ngOnInit(): void {
    if (this.gameConfig === undefined) {
      throw Error("Input gameConfig is undefined.");
    }
    this.setupKonva();
  }

  ngAfterViewInit(): void {
    let divSize = {
      width: this.hostElem.nativeElement.offsetWidth,
      height: this.hostElem.nativeElement.offsetHeight,
    }
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
      return;
    }
    let divSize = {
      width: this.hostElem.nativeElement.offsetWidth,
      height: this.hostElem.nativeElement.offsetHeight,
    }
    this.debug.add(`adjustCanvas called with host size: ${divSize.width} x ${divSize.height}`);
    let konvaSize = this.stage.size();
    let divCellSize = this.calcCellSize(divSize);
    const resized = this.cellSize !== divCellSize;
    if (resized) {
      this.debug.add(`Resized from ${this.cellSize} to ${divCellSize}`);
      // Without this Angular doesn't notice these changes because they're
      // triggered by the resize observer.
      this.ngZone.run(() => {
        this.cellSize = divCellSize;
        const newSize = {
          width: divCellSize * this.gameConfig.playfield.numCols,
          height: divCellSize * this.gameConfig.playfield.numRows,
        }
        this.stage.size(newSize);
        this.cdRef.markForCheck();
      });
    }
  }
}
