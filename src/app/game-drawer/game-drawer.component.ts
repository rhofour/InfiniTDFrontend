import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, ChangeDetectionStrategy, Pipe, PipeTransform, OnChanges, SimpleChanges } from '@angular/core';
import { MatList, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { SelectionService } from '../selection.service';
import { GameConfig, TowerConfig, MonsterConfig } from '../game-config';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { User } from '../user';
import { BackendService } from '../backend.service';
import { LoggedInUser } from '../logged-in-user';
import { WouldBlockPathPipe } from '../would-block-path.pipe';
import { DebugService } from '../debug.service';
import { RecordedBattleStateService } from '../recorded-battle-state.service';
import { BattleResults, BattleState } from '../battle-state';
import { BattleResultsComponent } from '../battle-results/battle-results.component';
import { BattlegroundSelectionView } from '../battleground-selection';
import { CellPosData } from '../types';

function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

interface WaveStats {
  totalMonsters: number,
  totalBounty: number,
}

type WaveList = [number, MonsterConfig][];

@Component({
  selector: 'app-game-drawer',
  templateUrl: './game-drawer.component.html',
  styleUrls: ['./game-drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDrawerComponent implements OnChanges {
  // Only one of these should be set at once.
  public inBattle: boolean = false;
  @Input() gameConfig!: GameConfig;
  @Input() towersState: TowersBgState = { towers: [] };
  @Input() battleState!: BattleState;
  @Input() displayedTower?: TowerConfig;
  @Input() buildTower?: TowerConfig;
  @Input() displayedMonster?: MonsterConfig;
  @Input() battlegroundSelection?: BattlegroundSelectionView;
  @ViewChild('buildList') buildList?: MatSelectionList;
  @ViewChild('monsterList') monsterList?: MatSelectionList;
  // user is the user we're displaying.
  @Input() user!: User;
  Math = Math;
  // State that must be updated when the inputs change.
  wave: [number, MonsterConfig][] = [];
  sellAmount?: number;
  buildCost?: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private selectionService: SelectionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public backend: BackendService,
    public debug: DebugService,
    private recordedBattleState: RecordedBattleStateService,
  ) { }

  ngOnInit(): void {
    if (this.user === undefined) {
      throw Error("Input user is undefined.");
    }
    this.wave = this.waveToList(this.user.wave);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.battleState !== undefined) {
      const prevBattle: BattleState = changes.battleState.previousValue;
      const newBattle: BattleState = changes.battleState.currentValue;

      if (prevBattle?.results === undefined && newBattle?.results !== undefined &&
         prevBattle?.live === true) {
        this.showResults(newBattle.results);
      }
    }

    if (changes.user !== undefined) {
      this.wave = this.waveToList(this.user.wave);
    }

    if (changes.towersState !== undefined || changes.buildTower !== undefined || changes.battlegroundSelection !== undefined) {
      this.calcBuildAndSellAmounts();
    }

    if (changes.buildTower !== undefined && this.buildList !== undefined) {
      for (let listOption of this.buildList.options) {
        listOption.selected = (listOption.value === this.buildTower?.id);
      }
    }

    if (changes.displayedMonster !== undefined && this.monsterList !== undefined) {
      for (let listOption of this.monsterList.options) {
        listOption.selected = (listOption.value === this.displayedMonster?.id);
      }
    }
  }

  calcBuildAndSellAmounts() {
    if (this.battlegroundSelection === undefined) {
      return;
    }

    const selectedTowers = this.battlegroundSelection.selectedTowers(this.towersState);
    // Update sell amount.
    if (selectedTowers.length === 0) {
      this.sellAmount = undefined;
    } else {
      this.sellAmount = 0
      for (const towerSelection of selectedTowers) {
        const towerConfig = this.gameConfig.towers.get(towerSelection.configId);
        if (towerConfig === undefined) {
          console.warn(`Could not find tower config for ID ${towerSelection.configId}.`);
          this.sellAmount = undefined;
          break;
        }
        this.sellAmount += this.gameConfig.misc.sellMultiplier * towerSelection.quantity * towerConfig.cost;
      }
    }

    // Update build cost.
    const buildTowerConfig = this.buildTower;
    if (buildTowerConfig) {
      const emptySelections = this.battlegroundSelection.emptyPositions(this.towersState);
      if (emptySelections.length > 0) {
        this.buildCost = emptySelections.length * buildTowerConfig.cost;
      } else {
        this.buildCost = undefined;
      }
    } else {
      this.buildCost = undefined;
    }

    this.cdRef.markForCheck();
  }

  waveToList(wave: number[]): WaveList {
    let monsters: [number, MonsterConfig][] = [];
    let lastMonsterConfig = undefined;
    let previousMonsters = 0;
    for (let monsterId of wave) {
      let monster = this.gameConfig.monsters.get(monsterId);
      if (monster !== undefined) {
        if (lastMonsterConfig?.id === monsterId) {
          previousMonsters += 1;
        } else {
          if (lastMonsterConfig) {
            monsters.push([previousMonsters, lastMonsterConfig]);
          }
          previousMonsters = 1;
          lastMonsterConfig = monster;
        }
      } else {
        console.warn(`Unknown monster ID: ${monsterId}`);
      }
    }
    if (lastMonsterConfig) {
      monsters.push([previousMonsters, lastMonsterConfig]);
    }
    return monsters;
  }

  trackByIndex(index:number, el:any): number {
    return index;
  }


  listToWave(waveList: WaveList): number[] {
    const size: number = waveList.reduce((acc, x) => acc + x[0], 0);
    let wave: number[] = new Array(size);
    let offset = 0;
    for (let listElem of waveList) {
      wave.fill(listElem[1].id, offset, offset + listElem[0]);
      offset += listElem[0];
    }
    return wave;
  }

  getWaveStats(): WaveStats {
    let stats = {
      totalMonsters: 0,
      totalBounty: 0,
    }
    for (let monsterId of this.user.wave) {
      let monster = this.gameConfig.monsters.get(monsterId);
      if (monster !== undefined) {
        stats.totalMonsters += 1;
        stats.totalBounty += monster.bounty;
      }
    }
    return stats;
  }

  buildSelectionChange(event: MatSelectionListChange) {
    for (const option of event.options) {
      // Find the first selected option.
      if (option.selected) {
        this.selectionService.updateBuildTowerSelection(option.value);
        return;
      }
    }
  }

  monsterSelectionChange(event: MatSelectionListChange) {
    for (const option of event.options) {
      // Find the first selected option.
      if (option.selected) {
        this.selectionService.updateAddMonsterSelection(option.value);
        return;
      }
    }
  }

  handleBackendError(actionErrDesc: string, err: Object) {
    console.warn(actionErrDesc);
    console.warn(err);
    if (hasOwnProperty(err, "message")) {
      this.snackBar.open(`${err.message}`, "Dismiss");
    } else {
      this.snackBar.open(`${err}`, "Dismiss");
    }
  }

  build(loggedInUser: LoggedInUser, tower: TowerConfig) {
    if (this.battlegroundSelection === undefined) {
      return;
    }
    const gridSel = this.battlegroundSelection.emptyPositions(this.towersState);
    if (gridSel.length === 0) {
      return;
    }
    this.backend.build(loggedInUser, tower.id, gridSel).catch((err) => {
      this.handleBackendError("Building error:", err);
    });
  }

  sell(loggedInUser: LoggedInUser) {
    if (this.battlegroundSelection === undefined) {
      return;
    }
    let gridSel = this.battlegroundSelection.towerPositions(this.towersState);
    this.backend.sell(loggedInUser, gridSel).catch((err) => {
      this.handleBackendError("Selling error:", err);
    });
  }

  addToWave(loggedInUser: LoggedInUser, user: User, newMonster: MonsterConfig) {
    const wave = [...user.wave, newMonster.id];
    this.backend.setWave(loggedInUser, wave).catch((err) => {
      this.handleBackendError("Error adding to wave:", err);
    });
  }

  clearWave(loggedInUser: LoggedInUser) {
    this.backend.clearWave(loggedInUser).catch((err) => {
      this.handleBackendError("Error clearing wave:", err);
    });
  }

  startBattle(loggedInUser: LoggedInUser) {
    this.dialog.closeAll();
    this.backend.startBattle(loggedInUser).catch((err) => {
      this.handleBackendError("Error starting battle:", err);
    });
  }

  stopBattle(loggedInUser: LoggedInUser) {
    this.backend.stopBattle(loggedInUser).catch((err) => {
      this.handleBackendError("Error stopping battle:", err);
    });
  }

  showBattle(attackerName: string, defenderName: string) {
    this.dialog.closeAll();
    this.recordedBattleState.requestBattleState(attackerName, defenderName);
  }

  stopShownBattle() {
    this.recordedBattleState.stopBattle();
  }

  showResults(results: BattleResults | undefined) {
    if (results === undefined) {
      console.warn("showResults called with undefined battle results.");
      return;
    }
    this.dialog.closeAll();
    BattleResultsComponent.openDialog(this.dialog, this.gameConfig, results);
  }

  monsterItemDropped(event: CdkDragDrop<LoggedInUser>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.wave, event.previousIndex, event.currentIndex);
    const newWave = this.listToWave(this.wave);
    this.backend.setWave(event.container.data, newWave).catch((err) => {
      this.handleBackendError("Error updating wave ordering:", err);
    });
  }

  monsterCountUpdate(lUser: LoggedInUser, idx: number, event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    this.wave[idx][0] = target.valueAsNumber;
    const newWave = this.listToWave(this.wave);
    this.backend.setWave(lUser, newWave).catch((err) => {
      this.handleBackendError("Error updating wave:", err);
    });
  }

  monsterClear(lUser: LoggedInUser, idx: number) {
    this.wave.splice(idx, 1);
    const newWave = this.listToWave(this.wave);
    this.backend.setWave(lUser, newWave).catch((err) => {
      this.handleBackendError("Error deleting from wave:", err);
    });
  }
}