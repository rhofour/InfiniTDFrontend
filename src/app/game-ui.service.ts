import { Injectable } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject } from 'rxjs';

export interface Selection {
  row: number,
  col: number,
}

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
    if (selection.row === curSelection?.row && selection.col === curSelection?.col) {
      this.selection$.next(undefined);
    } else {
      this.selection$.next(selection);
    }
  }
}
