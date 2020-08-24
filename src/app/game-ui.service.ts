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
    console.log("Incoming selection:");
    console.log(selection);
    let curSelection = this.selection$.getValue();
    console.log("Current selection:");
    console.log(curSelection);
    let newSelection = new Selection(undefined, undefined);
    console.log("New selection:");
    console.log(newSelection);
    if (selection.tower && !selection.tower.equals(curSelection.tower)) {
      newSelection.tower = selection.tower;
    }
    if (selection.grid && !selection.grid.equals(curSelection.grid)) {
      console.log("They're not equal.");
      newSelection.grid = selection.grid;
    }
    console.log("Final selection:");
    console.log(newSelection);
    this.selection$.next(newSelection);
  }
}
