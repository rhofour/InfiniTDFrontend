export interface CellPosData {
  row: number,
  col: number,
}

export class CellPos implements CellPosData {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  equals(other: CellPos): boolean {
    return this.row === other.row && this.col === other.col;
  }

  toNumber(numCols: number): number {
    return this.row * numCols + this.col;
  }

  static fromNumber(numCols: number, num: number): CellPos {
    return new CellPos(Math.floor(num / numCols), num % numCols);
  }
}
