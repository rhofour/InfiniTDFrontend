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

  toStrKey(): string {
    return this.row + '_' + this.col;
  }
}
