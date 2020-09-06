import { CellPos } from './types';
import { TowersBgState } from './battleground-state';

function cellToStr(cell: CellPos): string {
  return cell.row + '_' + cell.col;
}

function cellPosEquals(c1: CellPos, c2: CellPos): boolean {
  return c1.row === c2.row && c1.col === c2.col;
}

export function findShortestPaths(towers: TowersBgState, start: CellPos, end: CellPos): CellPos[][] {
  const rows = towers.towers.length;
  const cols = towers.towers[0].length;

  function getNeighbors(pos: CellPos): CellPos[] {
    let res = []
    if (pos.row > 0) { res.push({ row: pos.row - 1, col: pos.col }); }
    if (pos.row < rows - 1) { res.push({ row: pos.row + 1, col: pos.col }); }
    if (pos.col > 0) { res.push({ row: pos.row, col: pos.col - 1 }); }
    if (pos.col < cols - 1) { res.push({ row: pos.row, col: pos.col + 1 }); }
    return res;
  }

  let occupiedOrSeen: Set<string> = new Set()
  for (const [row, towersRow] of towers.towers.entries()) {
    for (const [col, tower] of towersRow.entries()) {
      if (tower !== undefined) {
        occupiedOrSeen.add(row + '_' + col)
      }
    }
  }

  if (occupiedOrSeen.has(cellToStr(start))) {
    return [];
  }

  let paths = [[ start ]];
  let finalPaths = [];
  while (paths.length > 0) {
    let newPaths = [];
    let newlySeen: Set<string> = new Set();
    for (const partialPath of paths) {
      const pathEnd: CellPos = partialPath[partialPath.length - 1];
      newlySeen.add(cellToStr(pathEnd));
      if (cellPosEquals(pathEnd, end)) {
        finalPaths.push(partialPath);
        continue;
      }
      for (const neighbor of getNeighbors(pathEnd)) {
        if (!occupiedOrSeen.has(cellToStr(neighbor))) {
          newPaths.push(partialPath.concat([neighbor]));
        }
      }
    }

    if (finalPaths.length > 0) {
      break;
    }
    paths = newPaths;
    for (const newCellStr of newlySeen) {
      occupiedOrSeen.add(newCellStr);
    }
  }

  return finalPaths;
}
