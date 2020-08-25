import { Injectable } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject } from 'rxjs';

export class TowerSelection {
  id: number

  constructor(id: number) {
    this.id = id;
  }

  equals(other: TowerSelection | undefined) {
    return other && this.id === other.id;
  }
}
export class GridSelection {
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

@Injectable({
  providedIn: 'root'
})
export class GameUiService {
  private selection$: BehaviorSubject<Selection> = new BehaviorSubject<Selection>(new Selection(undefined, undefined));

  constructor() { }

  getSelection() : Observable<Selection> {
    return this.selection$.asObservable();
  }

  select(selection: Selection) {
    let curSelection = this.selection$.getValue();
    let newSelection = new Selection(undefined, undefined);
    if (selection.tower) {
      if (!selection.tower.equals(curSelection.tower)) {
        newSelection.tower = selection.tower;
      }
    } else {
      newSelection.tower = curSelection.tower;
    }
    if (selection.grid) {
      if (!selection.grid.equals(curSelection.grid)) {
        newSelection.grid = selection.grid;
      }
    } else {
      newSelection.grid = curSelection.grid;
    }
    this.selection$.next(newSelection);
  }

  deselectTowers() {
    let selection = this.selection$.getValue();
    if (selection.tower) {
      selection.tower = undefined;
      this.selection$.next(selection);
    }
  }
}
