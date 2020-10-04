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

  interpolate(otherPos: CellPos, frac: number): CellPos {
    if (frac < 0 || frac > 1) {
      console.warn('CellPos.interpolate got invalid frac: ' + frac);
    }
    const row = this.row + frac * (otherPos.row - this.row);
    const col = this.col + frac * (otherPos.col - this.col);
    return new CellPos(row, col);
  }
}
