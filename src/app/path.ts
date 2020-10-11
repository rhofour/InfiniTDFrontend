import { CellPos } from './types';
import { TowersBgState, TowerBgState } from './battleground-state';

export class PathMap {
  constructor(public dists: Int16Array) { }
}

/* makeDistMap calculates the distance of every point from the start, stopping
 * if it finds the end.
 *
 * Used in makePathMap and pathExists.
 */
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

export function makePathMap(towers: TowersBgState, start: CellPos, end: CellPos): PathMap | undefined {
  const numRows = towers.towers.length;
  const numCols = towers.towers[0].length;
  const numCells = numRows * numCols;

  const startDistMap: PathMap = makeDistMap(towers, start, end);
  const shortestPathLength = startDistMap.dists[end.toNumber(numCols)];
  if (shortestPathLength < 0) { // No path exists
    return undefined;
  }
  let endDistMap: PathMap = makeDistMap(towers, end, start);

  // Every element i on a shortest path will have:
  // startDistMap.dists[i] + endDistMap.dists[i] == shortestPathLength
  let dists = new Int16Array(numCells);
  dists.fill(-1);
  for (let i = 0; i < numCells; i++) {
    if (startDistMap.dists[i] + endDistMap.dists[i] == shortestPathLength) {
      dists[i] = startDistMap.dists[i];
    }
  }
  return new PathMap(dists);
}
