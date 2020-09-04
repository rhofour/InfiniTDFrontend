import { Injectable, OnDestroy } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject, Subscription } from 'rxjs';

import { BattlegroundState, TowerBgState } from './battleground-state';
import { BattlegroundStateService } from './battleground-state.service';
import { GameConfig, TowerConfig } from './game-config';
import { GameConfigService } from './game-config.service';

export class NewBuildSelection {
  // Tower that's selected from the build panel.
  kind: 'build' = 'build'
  id: number

  constructor(id: number) {
    this.id = id;
  }

  equals(other: TowerConfig | undefined) {
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
  buildTower: TowerConfig | undefined
  gridTower: TowerConfig | undefined
  grid: GridSelection | undefined

  constructor(buildTower?: TowerConfig, gridTower?: TowerConfig, grid?: GridSelection) {
    this.buildTower = buildTower; // Tower selected from the build menu
    this.gridTower = gridTower; // Tower selected from the battleground
    this.grid = grid;
  }
}

@Injectable()
export class SelectionService implements OnDestroy {
  private selection$: BehaviorSubject<Selection> = new BehaviorSubject<Selection>(new Selection());
  private subscription: Subscription = Subscription.EMPTY;
  private battlegroundState?: BattlegroundState;
  private gameConfig!: GameConfig;

  constructor(
    private bgStateService: BattlegroundStateService,
    private gameConfigService: GameConfigService,
  ) {
    // TODO: Add this to a subscription to be cleaned up later
    gameConfigService.getConfig().subscribe((gameConfig) => this.gameConfig = gameConfig);
  }

  setUsername(username: string) {
    this.subscription.unsubscribe();
    this.subscription = this.bgStateService.getBattlegroundState(username)
      .subscribe((bgState: BattlegroundState) => this.updateBattlegroundState(bgState));
  }

  private updateBattlegroundState(bgState: BattlegroundState) {
    this.battlegroundState = bgState;

    let selection = this.selection$.getValue();
    if (selection.grid) {
      this.selection$.next(this.updateGridTowerFromSelection(selection));
    }
  }

  getSelection() : Observable<Selection> {
    return this.selection$.asObservable();
  }

  private updateGridTowerFromSelection(selection: Selection): Selection {
    if (this.battlegroundState === undefined) {
      console.warn("SelectionService battlegroundState is undefined when updateGridTowerFromSelection is called.");
      return selection;
    }

    const gridSelection = selection.grid;
    if (gridSelection) {
      const gridTowerId =
        this.battlegroundState.towers.towers[gridSelection.row]?.[gridSelection.col]?.id;
      selection.gridTower = gridTowerId !== undefined ?
        this.gameConfig.towers.get(gridTowerId) : undefined;
      // If the new grid selection contains a tower then remove the tower selection,
      // unless it matches
      if (selection.gridTower !== undefined &&
          selection.gridTower.id !== selection.buildTower?.id) {
        selection.buildTower = undefined;
      }
    }
    return selection;
  }

  updateSelection(newSelection: GridSelection | NewBuildSelection) {
    if (this.battlegroundState === undefined) {
      console.warn("SelectionService battelgroundState is undefined when updateSelection is called.");
      return;
    }
    let curSelection = this.selection$.getValue();
    switch (newSelection.kind) {
      case 'grid': {
        if (newSelection.equals(curSelection.grid)) {
          curSelection.grid = undefined;
          curSelection.gridTower = undefined;
        } else {
          curSelection.grid = newSelection;
          curSelection = this.updateGridTowerFromSelection(curSelection);
        }
        break;
      }
      case 'build': {
        if (!newSelection.equals(curSelection.buildTower)) {
          curSelection.buildTower = this.gameConfig.towers.get(newSelection.id);
          // If a grid tower is currently selected deselect it.
          if (curSelection.gridTower) {
            curSelection.grid = undefined;
            curSelection.gridTower = undefined;
          }
        } else {
          curSelection.buildTower = undefined;
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
