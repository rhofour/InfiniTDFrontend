import { CellPos } from './types';
import { TowersBgState, TowerBgState } from './battleground-state';

class PathMap {
  constructor(public dists: Int16Array) { }
}

function makeDistMap(towers: TowersBgState, start: CellPos, end: CellPos): PathMap {
  const numRows = towers.towers.length;
  const numCols = towers.towers[0].length;
  const numCells = numRows * numCols;

  // Distance from the start with -1 being unknown and -2 being impassable.
  let dists: Int16Array = new Int16Array(numCells);
  dists.fill(-1);
  let i = 0;
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    let row: (TowerBgState | undefined)[] = towers.towers[rowIdx];
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      let tower: (TowerBgState | undefined) = row[colIdx];
      if (tower) {
        dists[i] = -2;
      }
      i++;
    }
  }

  const startNumber = start.toNumber(numCols);
  if (dists[startNumber] !== -1) {
    return new PathMap(dists);
  }
  const endNumber = end.toNumber(numCols);
  if (dists[endNumber] !== -1) {
    return new PathMap(dists);
  }

  function getNeighbors(pos: number): number[] {
    let res = []
    const col = pos % numCols;
    const row = pos / numCols;
    if (col > 0) { res.push(pos - 1) };
    if (col < numCols - 1) { res.push(pos + 1) };
    if (row >= 1) { res.push(pos - numCols) };
    if (row < numRows - 1) { res.push(pos + numCols) };
    return res;
  }

  let frontier: number[] = [startNumber];
  let dist = 0;
  dists[startNumber] = 0
  while (dists[endNumber] == -1 && frontier.length) {
    let nextFrontier: number[] = [];
    for (let i = 0; i < frontier.length; i++) {
      let frontierElem: number = frontier[i];
      let neighbors = getNeighbors(frontierElem);
      for (let j = 0; j < neighbors.length; j++) {
        let neighbor: number = neighbors[j];
        if (dists[neighbor] == -1) {
          dists[neighbor] = dist + 1;
          nextFrontier.push(neighbor);
        }
      }
    }

    dist++;
    frontier = nextFrontier;
  }

  return new PathMap(dists);
}

export function pathExists(towers: TowersBgState, start: CellPos, end: CellPos): boolean {
  const numCols = towers.towers[0].length;
  const pathMap = makeDistMap(towers, start, end);
  return pathMap.dists[end.toNumber(numCols)] >= 0;
}

export function makePathMap(towers: TowersBgState, start: CellPos, end: CellPos): number[][] {
  return [];
}

export const findShortestPaths = (function() {
  // Memoization data
  let cache: Map<string, number[][]> = new Map();
  let cachedStart: number | undefined = undefined;
  let cachedEnd: number | undefined = undefined;
  let cachedWidth: number | undefined = undefined;
  let cachedHeight: number | undefined = undefined;

  function innerFunction(towers: TowersBgState, start: CellPos, end: CellPos, memoized: boolean = true): number[][] {
    const numRows = towers.towers.length;
    const numCols = towers.towers[0].length;
    const numCells = numRows * numCols;

    // Helper functions
    function getNeighbors(pos: number): number[] {
      let res = []
      const col = pos % numCols;
      const row = pos / numCols;
      if (col > 0) { res.push(pos - 1) };
      if (col < numCols - 1) { res.push(pos + 1) };
      if (row >= 1) { res.push(pos - numCols) };
      if (row < numRows - 1) { res.push(pos + numCols) };
      return res;
    }

    const startNumber = start.toNumber(numCols);
    const endNumber = end.toNumber(numCols);
    let occupiedOrSeen: Int8Array = new Int8Array(numCells);
    let i = 0;
    let bytes = [];
    let x = 0;
    for (const [row, towersRow] of towers.towers.entries()) {
      for (const [col, tower] of towersRow.entries()) {
        if (tower !== undefined) {
          occupiedOrSeen[(row * numCols) + col] = 1;
          x += Math.pow(2, i);
        }
        i++;
        if (i > 15) {
          bytes.push(x);
          x = 0;
          i = 0;
        }
      }
    }
    if (i > 0) {
      bytes.push(x);
    }
    let memoizationKey: string = String.fromCharCode(...bytes);

    if (occupiedOrSeen[startNumber] === 1) {
      return [];
    }

    // Check if we can consult our cache.
    if (startNumber !== cachedStart || endNumber !== cachedEnd || numRows !== cachedHeight || numCols !== cachedWidth) {
      cache = new Map();
      cachedStart = startNumber;
      cachedEnd = endNumber;
      cachedHeight = numRows;
      cachedWidth = numCols;
    }
    if (memoized) {
      const cachedValue = cache.get(memoizationKey);
      if (cachedValue) {
        return cachedValue;
      }
    }

    let paths = [[ startNumber ]];
    let finalPaths = [];
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

    if (memoized) {
      cache.set(memoizationKey, finalPaths);
    }
    return finalPaths;
  }
  return innerFunction;
})();
