import { CellPos } from './types';
import { TowersBgState } from './battleground-state';

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
