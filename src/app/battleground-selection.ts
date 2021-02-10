import { config } from 'rxjs';
import { BattlegroundState, TowersBgState } from './battleground-state';
import { CellPosData } from './types';

export interface TowerTypeSelection {
    configId: number;
    quantity: number;
}

export class BattlegroundSelectionView {
    constructor(private bgSelection: BattlegroundSelection) { }

    isSelected(row: number, col: number) {
        return this.bgSelection.isSelected(row, col);
    }

    selectedTowers(towersState: TowersBgState): TowerTypeSelection[] {
        return this.bgSelection.selectedTowers(towersState);
    }

    towerPositions(towersState: TowersBgState): CellPosData[] {
        return this.bgSelection.towerPositions(towersState);
    }

    numSelected(): number {
        return this.bgSelection.numSelected;
    }

    empty(): boolean {
        return this.bgSelection.empty();
    }
}
export class BattlegroundSelection {
    private selections: Int8Array;
    private numCols: number;
    private numRows: number;
    private _numSelected: number;

    constructor(numRows: number, numCols: number) {
        this._numSelected = 0;
        this.numRows = numRows;
        this.numCols = numCols;
        this.selections = new Int8Array(numRows * numCols);
    }

    static makeEmpty(numRows: number, numCols: number): BattlegroundSelection {
        return new BattlegroundSelection(numRows, numCols);
    }

    toggle(additional: boolean, row: number, col: number) {
        const idx = (row * this.numCols) + col;
        if (this.selections[idx]) {
            if (additional) {
                this._numSelected -= 1;
                this.selections[idx] = 0;
            } else {
                this.reset();
            }
        } else {
            if (additional) {
                this._numSelected += 1;
                this.selections[idx] = 1;
            } else {
                this.reset();
                this._numSelected = 1;
                this.selections[idx] = 1;
            }
        }
    }

    reset() {
        this.selections.fill(0);
        this._numSelected = 0;
    }

    get numSelected(): number {
        return this._numSelected;
    }

    move(deltaRow: number, deltaCol: number): boolean {
        if (this._numSelected !== 1) {
            return false;
        }
        for (let i = 0; i < this.selections.length; i++) {
            if (this.selections[i]) {
                const row = Math.floor(i / this.numCols);
                const col = i % this.numCols;
                const newRow = Math.min(this.numRows - 1, Math.max(0, row + deltaRow));
                const newCol = Math.min(this.numCols - 1, Math.max(0, col + deltaCol));
                const newIdx = (newRow * this.numCols) + newCol;
                if (newIdx === i) {
                    return false;
                }
                this.selections[newIdx] = this.selections[i];
                this.selections[i] = 0;
                return true;
            }
        }
        console.warn("This should never be reached.");
        return false;
    }

    isSelected(row: number, col: number): boolean {
        return this.selections[(row * this.numCols) + col] !== 0;
    }

    selectedTowers(towersState: TowersBgState): TowerTypeSelection[] {
        let towerQuantities = new Map();
        for (let i = 0; i < this.selections.length; i++) {
            if (this.selections[i] === 0) {
                continue;
            }
            const row = Math.floor(i / this.numCols);
            const col = i % this.numCols;
            const towerId = towersState.towers[row][col]?.id;
            if (towerId) {
                const oldQuantity = towerQuantities.get(towerId) ?? 0;
                towerQuantities.set(towerId, oldQuantity + 1);
            }
        }
        let output: TowerTypeSelection[] = [];
        towerQuantities.forEach((quantity, configId) => {
            output.push({ configId: configId, quantity: quantity });
        });
        return output;
    }

    towerPositions(towersState: TowersBgState): CellPosData[] {
        let output: CellPosData[] = [];
        for (let i = 0; i < this.selections.length; i++) {
            if (this.selections[i] === 0) {
                continue;
            }
            const row = Math.floor(i / this.numCols);
            const col = i % this.numCols;
            const towerId = towersState.towers[row][col]?.id;
            if (towerId) {
                output.push({ row: row, col: col });
            }
        }
        return output;
    }

    empty(): boolean {
        return this.numSelected > 0;
    }

    getView(): BattlegroundSelectionView {
        return new BattlegroundSelectionView(this);
    }
}