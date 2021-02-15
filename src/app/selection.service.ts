import { Injectable, OnDestroy } from '@angular/core';
import { of, throwError, Observable, BehaviorSubject, Subscription } from 'rxjs';

import { BattlegroundState, TowerBgState } from './battleground-state';
import { BattlegroundStateService } from './battleground-state.service';
import { GameConfig, TowerConfig, MonsterConfig } from './game-config';
import { BattlegroundSelection, BattlegroundSelectionView } from './battleground-selection';
import { GameConfigService } from './game-config.service';

@Injectable()
export class SelectionService implements OnDestroy {
  private bgStateSub: Subscription = Subscription.EMPTY;
  private gameConfigSub: Subscription = Subscription.EMPTY;
  private battlegroundState?: BattlegroundState;
  private gameConfig!: GameConfig;
  // Selection state
  private addMonsterSelection?: MonsterConfig;
  private battlegroundSelection?: BattlegroundSelection;
  // BehaviorSubjects
  private displayedTower$: BehaviorSubject<TowerConfig | undefined> =
   new BehaviorSubject<TowerConfig | undefined>(undefined);
  private buildTower$: BehaviorSubject<TowerConfig | undefined> =
   new BehaviorSubject<TowerConfig | undefined>(undefined);
  private displayedMonster$: BehaviorSubject<MonsterConfig | undefined> =
   new BehaviorSubject<MonsterConfig | undefined>(undefined);
  private battleground$: BehaviorSubject<BattlegroundSelectionView | undefined> =
   new BehaviorSubject<BattlegroundSelectionView | undefined>(undefined);

  constructor(
    private bgStateService: BattlegroundStateService,
    private gameConfigService: GameConfigService,
  ) {
    this.gameConfigSub = this.gameConfigService.getConfig().subscribe(
      (gameConfig: GameConfig) => {
        this.gameConfig = gameConfig;
        this.reset();
      }
    );
  }

  setUsername(username: string) {
    this.bgStateSub.unsubscribe();
    this.reset();
    this.bgStateSub =
      this.bgStateService.getBattlegroundState(username).subscribe(
        (bgState: BattlegroundState) => {
          this.battlegroundState = bgState;
          this.updateDisplayedTower();
        });
  }

  reset() {
    this.addMonsterSelection = undefined;
    if (this.gameConfig) {
      this.battlegroundSelection = BattlegroundSelection.makeEmpty(
        this.gameConfig.playfield.numRows, this.gameConfig.playfield.numCols);
    }
    this.displayedTower$.next(undefined);
    this.buildTower$.next(undefined);
    this.displayedMonster$.next(undefined);
    this.battleground$.next(undefined);
  }

  getDisplayedTower(): Observable<TowerConfig | undefined> {
    return this.displayedTower$.asObservable();
  }

  getBuildTower(): Observable<TowerConfig | undefined> {
    return this.buildTower$.asObservable();
  }

  getDisplayedMonster(): Observable<MonsterConfig | undefined> {
    return this.displayedMonster$.asObservable();
  }

  getBattleground(): Observable<BattlegroundSelectionView | undefined> {
    return this.battleground$.asObservable();
  }

  private calcDisplayedTower(): TowerConfig | undefined {
    if (this.battlegroundState === undefined) {
      return undefined;
    }
    // Start with battleground selection. If there's more than one type of tower selected
    // unset displayedTower.
    const selectedTowers = this.battlegroundSelection?.selectedTowers(this.battlegroundState.towers);
    if (selectedTowers === undefined || selectedTowers.length === 0) {
      // If no towers are selected revert to buildTower$ (which may be undefined).
      return this.buildTower$.getValue();
    }
    else if (selectedTowers?.length > 1) {
      return undefined;
    }
    // Return the only tower type in the battleground selection.
    const selectedTowerType = selectedTowers[0].configId;
    return this.gameConfig.towers.get(selectedTowerType);
  }

  private updateDisplayedTower() {
    const newDisplayedTower: TowerConfig | undefined = this.calcDisplayedTower();
    this.displayedTower$.next(newDisplayedTower);
    if (newDisplayedTower !== this.buildTower$.getValue()) {
      // Unset buildTower$ if it doesn't match the displayed tower.
      this.buildTower$.next(undefined);
    }
  }

  updateBuildTowerSelection(newBuildTowerSelectionId?: number) {
    if (this.buildTower$.getValue()?.id === newBuildTowerSelectionId) {
      return;
    }
    const newBuildTowerSelection = newBuildTowerSelectionId === undefined ?
     undefined : this.gameConfig.towers.get(newBuildTowerSelectionId);
    this.buildTower$.next(newBuildTowerSelection);
    if (newBuildTowerSelection && this.battlegroundState) {
      // Reset battleground selection if it includes a different type of tower.
      if (this.battlegroundSelection) {
        const selectedTowers = this.battlegroundSelection.selectedTowers(this.battlegroundState.towers);
        if (selectedTowers.length > 1 ||
            (selectedTowers.length == 1 && selectedTowers[0].configId !== newBuildTowerSelectionId)) {
          this.battlegroundSelection.reset();
          this.battleground$.next(this.battlegroundSelection.getView());
        }
      }
    }
    this.updateDisplayedTower();
  }

  updateAddMonsterSelection(newAddMonsterSelection?: MonsterConfig) {
    if (this.addMonsterSelection == newAddMonsterSelection) {
      return;
    }
    this.addMonsterSelection = newAddMonsterSelection;
  }

  toggleBattlegroundSelection(additional: boolean, row: number, col: number) {
    if (this.battlegroundSelection === undefined) {
      return;
    }
    this.battlegroundSelection.toggle(additional, row, col);
    this.battleground$.next(this.battlegroundSelection.getView());
    this.updateDisplayedTower();
  }

  // Passthrough to battlegroundSelection
  move(deltaRow: number, deltaCol: number) {
    if (this.battlegroundSelection) {
      if (this.battlegroundSelection.move(deltaRow, deltaCol)) {
        this.battleground$.next(this.battlegroundSelection.getView());
        this.updateDisplayedTower();
      }
    }
  }

  ngOnDestroy() {
    this.bgStateSub.unsubscribe();
    this.gameConfigSub.unsubscribe();
  }
}
