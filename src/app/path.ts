import { CellPos } from './types';
import { TowersBgState } from './battleground-state';

export function findShortestPaths(towers: TowersBgState, start: CellPos, end: CellPos): CellPos[][] {
  const rows = towers.towers.length;
  const cols = towers.towers[0].length;

  function getNeighbors(pos: number): number[] {
    let res = []
    if (pos % cols > 0) { res.push(pos - 1) };
    if (pos % cols < cols - 1) { res.push(pos + 1) };
    if (pos / cols >= 1) { res.push(pos - cols) };
    if (pos / cols < rows - 1) { res.push(pos + cols) };
    return res;
  }
  function toCellPos(pos: number): CellPos {
    return new CellPos(Math.floor(pos / cols), pos % cols);
  }
  function toNumber(cp: CellPos): number {
    return cp.row * cols + cp.col;
  }

  let occupiedOrSeen: Set<number> = new Set()
  for (const [row, towersRow] of towers.towers.entries()) {
    for (const [col, tower] of towersRow.entries()) {
      if (tower !== undefined) {
        occupiedOrSeen.add((row * cols) + col)
      }
    }
  }

  if (occupiedOrSeen.has(toNumber(start))) {
    return [];
  }

  let paths = [[ toNumber(start) ]];
  let finalPaths = [];
  const endNumber = toNumber(end);
  while (paths.length > 0) {
    let newPaths = [];
    let newlySeen: Set<number> = new Set();
    for (const partialPath of paths) {
      const pathEnd: number = partialPath[partialPath.length - 1];
      newlySeen.add(pathEnd);
      if (pathEnd === endNumber) {
        finalPaths.push(partialPath);
        continue;
      }
      for (const neighbor of getNeighbors(pathEnd)) {
        if (!occupiedOrSeen.has(neighbor)) {
          // TODO: Try modifying partial path instead
          newPaths.push(partialPath.concat([neighbor]));
        }
      }
    }

    if (finalPaths.length > 0) {
      break;
    }
    paths = newPaths;
    for (const newPos of newlySeen) {
      occupiedOrSeen.add(newPos);
    }
  }

  return finalPaths.map(path => path.map(toCellPos));
}
