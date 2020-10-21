import { Injectable, OnDestroy } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject, Subscription } from 'rxjs';

import { BattlegroundState, TowerBgState } from './battleground-state';
import { BattlegroundStateService } from './battleground-state.service';
import { GameConfig, TowerConfig, MonsterConfig } from './game-config';
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
export class NewMonsterSelection {
  kind: 'monster' = 'monster'
  id: number

  constructor(id: number) {
    this.id = id;
  }

  equals(other: MonsterConfig | undefined) {
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

  move(deltaRow: number, deltaCol: number, rows: number, cols: number) {
    const oldRow = this.row;
    const oldCol = this.col;
    this.row = Math.min(rows - 1, Math.max(0, this.row + deltaRow));
    this.col = Math.min(cols - 1, Math.max(0, this.col + deltaCol));
    return oldRow !== this.row || oldCol !== this.col;
  }
}
export class Selection {
  buildTower: TowerConfig | undefined
  monster: MonsterConfig | undefined
  gridTower: TowerConfig | undefined
  grid: GridSelection | undefined

  constructor(buildTower?: TowerConfig, monster?: MonsterConfig,
      gridTower?: TowerConfig, grid?: GridSelection) {
    this.buildTower = buildTower; // Tower selected from the build menu
    this.monster = monster;
    this.gridTower = gridTower; // Tower selected from the battleground
    this.grid = grid;
  }

  move(deltaRow: number, deltaCol: number, rows: number, cols: number): boolean {
    if (this.grid) {
      return this.grid.move(deltaRow, deltaCol, rows, cols);
    }
    return false;
  }
}

@Injectable()
export class SelectionService implements OnDestroy {
  private selection$: BehaviorSubject<Selection> = new BehaviorSubject<Selection>(new Selection());
  private bgStateSub: Subscription = Subscription.EMPTY;
  private gameConfigSub: Subscription = Subscription.EMPTY;
  private battlegroundState?: BattlegroundState;
  private gameConfig!: GameConfig;

  constructor(
    private bgStateService: BattlegroundStateService,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfigSub =
      gameConfigService.getConfig().subscribe((gameConfig) => {
        this.gameConfig = gameConfig;
      });
  }

  setUsername(username: string) {
    this.bgStateSub.unsubscribe();
    this.bgStateSub =
      this.bgStateService.getBattlegroundState(username).subscribe(
        (bgState: BattlegroundState) => this.updateBattlegroundState(bgState));
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

  move(deltaRow: number, deltaCol: number) {
    let selection = this.selection$.getValue();
    if (selection.move(deltaRow, deltaCol, this.gameConfig.playfield.numRows,
        this.gameConfig.playfield.numCols)) {
      this.selection$.next(this.updateGridTowerFromSelection(selection));
    }
  }

  // TODO: See if we could better enforce these properties within the
  // selection object.
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

  updateSelection(newSelection: GridSelection | NewBuildSelection | NewMonsterSelection) {
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
          curSelection.monster = undefined;
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
      case 'monster': {
        if (!newSelection.equals(curSelection.monster)) {
          curSelection.monster = this.gameConfig.monsters.get(newSelection.id);
          // Remove any grid or tower selections.
          curSelection.grid = undefined;
          curSelection.gridTower = undefined;
          curSelection.buildTower = undefined;
        } else {
          curSelection.monster = undefined;
        }
        break;
      }
      default: const _exhaustiveCheck: never = newSelection;
    }
    this.selection$.next(curSelection);
  }

  ngOnDestroy() {
    this.gameConfigSub.unsubscribe();
    this.bgStateSub.unsubscribe();
  }
}
