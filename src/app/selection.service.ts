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
  private buildTowerSelection?: TowerConfig;
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
    )
  }

  setUsername(username: string) {
    this.bgStateSub.unsubscribe();
    this.reset();
    this.bgStateSub =
      this.bgStateService.getBattlegroundState(username).subscribe(
        (bgState: BattlegroundState) => {
          this.updateDisplayedTower();
        });
  }

  reset() {
    this.buildTowerSelection = undefined;
    this.addMonsterSelection = undefined;
    if (this.gameConfig) {
      this.battlegroundSelection = BattlegroundSelection.makeEmpty(
        this.gameConfig.playfield.numRows, this.gameConfig.playfield.numCols);
    }
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

  private updateDisplayedTower() {
    // TODO: update displayedTower based on battlegroundSelection and buildTowerSelection
  }

  updateBuildTowerSelection(newBuildTowerSelection?: TowerConfig) {
    if (this.buildTowerSelection === newBuildTowerSelection) {
      return;
    }
    this.buildTowerSelection = newBuildTowerSelection;
    // TODO: restrict battlegroundState to only open squares
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
