import { Injectable } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject } from 'rxjs';

export class TowerSelection {
  kind: 'tower' = 'tower'
  id: number

  constructor(id: number) {
    this.id = id;
  }

  equals(other: TowerSelection | undefined) {
    return other && this.id === other.id;
  }
}
export class GridSelection {
  kind: 'grid' = 'grid'
  row: number
  col: number

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  equals(other: GridSelection | undefined) {
    return other && this.row === other.row && this.col === other.col;
  }
}
export class Selection {
  tower: TowerSelection | undefined
  grid: GridSelection | undefined

  constructor(tower: TowerSelection | undefined, grid: GridSelection | undefined) {
    this.tower = tower;
    this.grid = grid;
  }
}

@Injectable()
export class SelectionService {
  private selection$: BehaviorSubject<Selection> = new BehaviorSubject<Selection>(new Selection(undefined, undefined));

  constructor() { }

  getSelection() : Observable<Selection> {
    return this.selection$.asObservable();
  }

  updateSelection(newSelection: GridSelection | TowerSelection) {
    let curSelection = this.selection$.getValue();
    switch (newSelection.kind) {
      case 'grid': {
        if (!newSelection.equals(curSelection.grid)) {
          curSelection.grid = newSelection;
          // If the new grid selection contains a tower then remove the
          // tower selection.
          // TODO(rofer)
        } else {
          curSelection.grid = undefined;
        }
        break;
      }
      case 'tower': {
        if (!newSelection.equals(curSelection.tower)) {
          curSelection.tower = newSelection;
        } else {
          curSelection.tower = undefined;
        }
        break;
      }
      default: const _exhaustiveCheck: never = newSelection;
    }
    this.selection$.next(curSelection);
  }

  deselectTowers() {
    let selection = this.selection$.getValue();
    if (selection.tower) {
      selection.tower = undefined;
      this.selection$.next(selection);
    }
  }
}
