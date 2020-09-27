import { CellPos } from './types';
import { TowersBgState } from './battleground-state';

export function findShortestPaths(towers: TowersBgState, start: CellPos, end: CellPos): CellPos[][] {
  const rows = towers.towers.length;
  const cols = towers.towers[0].length;
  const numCells = rows * cols;

  function getNeighbors(pos: number): number[] {
    let res = []
    const col = pos % cols;
    const row = pos / cols;
    if (col > 0) { res.push(pos - 1) };
    if (col < cols - 1) { res.push(pos + 1) };
    if (row >= 1) { res.push(pos - cols) };
    if (row < rows - 1) { res.push(pos + cols) };
    return res;
  }
  function toCellPos(pos: number): CellPos {
    return new CellPos(Math.floor(pos / cols), pos % cols);
  }
  function toNumber(cp: CellPos): number {
    return cp.row * cols + cp.col;
  }

  let occupiedOrSeen: Int8Array = new Int8Array(numCells);
  for (const [row, towersRow] of towers.towers.entries()) {
    for (const [col, tower] of towersRow.entries()) {
      if (tower !== undefined) {
        occupiedOrSeen[(row * cols) + col] = 1;
      }
    }
  }

  if (occupiedOrSeen[toNumber(start)] === 1) {
    return [];
  }

  let paths = [[ toNumber(start) ]];
  let finalPaths = [];
  const endNumber = toNumber(end);
  while (paths.length > 0) {
    let newPaths = [];
    let newlySeen: number[] = [];
    for (const partialPath of paths) {
      const pathEnd: number = partialPath[partialPath.length - 1];
      newlySeen.push(pathEnd);
      if (pathEnd === endNumber) {
        finalPaths.push(partialPath);
        continue;
      }
      for (const neighbor of getNeighbors(pathEnd)) {
        if (occupiedOrSeen[neighbor] !== 1) {
          newPaths.push(partialPath.concat([neighbor]));
        }
      }
    }

    if (finalPaths.length > 0) {
      break;
    }
    paths = newPaths;
    for (const newPos of newlySeen) {
      occupiedOrSeen[newPos] = 1;
    }
  }

  return finalPaths.map(path => path.map(toCellPos));
}
