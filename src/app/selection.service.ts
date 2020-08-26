import { Injectable, OnDestroy } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject, Subscription } from 'rxjs';

import { BattlegroundState, TowerBgState } from './battleground-state';
import { BattlegroundStateService } from './battleground-state.service';

export class TowerSelection {
  // Tower that's selected from the game drawer.
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
  // Part of the playfield that's selected.
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
export class SelectionService implements OnDestroy {
  private selection$: BehaviorSubject<Selection> = new BehaviorSubject<Selection>(new Selection(undefined, undefined));
  private subscription: Subscription = Subscription.EMPTY;
  private battlegroundState?: BattlegroundState;

  constructor(private bgStateService: BattlegroundStateService) { }

  setUsername(username: string) {
    this.subscription = this.bgStateService.getBattlegroundState(username)
      .subscribe((bgState: BattlegroundState) => this.battlegroundState = bgState);
  }

  getSelection() : Observable<Selection> {
    return this.selection$.asObservable();
  }

  updateSelection(newSelection: GridSelection | TowerSelection) {
    if (this.battlegroundState === undefined) {
      console.warn("SelectionService battelgroundState is undefined when updateSelection is called.");
      return;
    }
    let curSelection = this.selection$.getValue();
    switch (newSelection.kind) {
      case 'grid': {
        if (!newSelection.equals(curSelection.grid)) {
          curSelection.grid = newSelection;
          // If the new grid selection contains a tower then remove the
          // tower selection.
          let towerId =
            this.battlegroundState.towers.towers[newSelection.row]?.[newSelection.col]?.id;
          if (towerId) {
            curSelection.tower = undefined;
          }
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
