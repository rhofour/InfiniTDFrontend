import { Injectable } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject } from 'rxjs';

export interface TowerSelection {
  kind: 'tower',
  id: number,
}
export interface GridSelection {
  kind: 'grid',
  row: number,
  col: number,
}
export type Selection = TowerSelection | GridSelection;

@Injectable({
  providedIn: 'root'
})
export class GameUiService {
  private selection$: BehaviorSubject<Selection | undefined> = new BehaviorSubject<Selection | undefined>(undefined);

  constructor() { }

  getSelection() : Observable<Selection | undefined> {
    return this.selection$.asObservable();
  }

  select(selection: Selection) {
    let curSelection = this.selection$.getValue();
    if (GameUiService.selectionsMatch(selection, curSelection)) {
      this.selection$.next(undefined);
    } else {
      this.selection$.next(selection);
    }
  }

  private static selectionsMatch(selectionA: Selection, selectionB?: Selection): boolean {
    switch (selectionA.kind) {
      case 'grid': {
        return (selectionB?.kind === 'grid' && selectionA.row === selectionB.row && selectionA.col === selectionB.col);
      }
      case 'tower': {
        return (selectionB?.kind === 'tower' && selectionA.id === selectionB.id);
      }
      default: {
        const _exhaustiveCheck: never = selectionA;
        return _exhaustiveCheck;
      }
    }
  }
}
