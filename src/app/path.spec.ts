import { CellPos } from './types';
import { TowersBgState } from './battleground-state';
import { findShortestPaths } from './path';

function makeEmptyArray(rows: number, cols: number) {
  return Array(rows).fill(undefined).map((_) => Array(cols).fill(undefined));
}

describe('findShortestPaths', () => {
  it('no path', () => {
    let towers = makeEmptyArray(2, 2);
    towers[0][1] = { id: 0 };
    towers[1][0] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    const paths = findShortestPaths(
      towersBgState, { row: 0, col: 0 }, { row: 1, col: 1 });

    expect(paths).toEqual([]);
  });

  it('no path when start blocked', () => {
    let towers = makeEmptyArray(2, 2);
    towers[0][0] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    const paths = findShortestPaths(
      towersBgState, { row: 0, col: 0 }, { row: 1, col: 1 });

    expect(paths).toEqual([]);
  });

  it('no path when end blocked', () => {
    let towers = makeEmptyArray(2, 2);
    towers[1][1] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    const paths = findShortestPaths(
      towersBgState, { row: 0, col: 0 }, { row: 1, col: 1 });

    expect(paths).toEqual([]);
  });

  it('one step path', () => {
    let towers = makeEmptyArray(2, 2);
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    const paths = findShortestPaths(
      towersBgState, { row: 0, col: 0 }, { row: 0, col: 1 });

    expect(paths).toEqual([[ { row: 0, col: 0 }, { row: 0, col: 1 } ]]);
  });

  it('multistep path', () => {
    let towers = makeEmptyArray(2, 3);
    towers[0][1] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    const paths = findShortestPaths(
      towersBgState, { row: 0, col: 0 }, { row: 0, col: 2 });

    expect(paths).toEqual([
      [ { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 0, col: 2 } ]
    ]);
  });

  it('multiple paths', () => {
    let towers = makeEmptyArray(3, 3);
    towers[1][1] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    const paths = findShortestPaths(
      towersBgState, { row: 0, col: 0 }, { row: 2, col: 2 });

    expect(paths).toEqual(jasmine.arrayWithExactContents([
      [ { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 } ],
      [ { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 } ],
    ]));
  });

  it('many paths', () => {
    let towers = makeEmptyArray(3, 3);

    const towersBgState: TowersBgState = {
      towers: towers,
    };

    const paths = findShortestPaths(
      towersBgState, { row: 0, col: 0 }, { row: 2, col: 2 });

    expect(paths.length).toEqual(6);
  });
});
