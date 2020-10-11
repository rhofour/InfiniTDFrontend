import { CellPos } from './types';
import { TowersBgState } from './battleground-state';
import { pathExists, makePathMap } from './path';

function makeEmptyArray(rows: number, cols: number) {
  return Array(rows).fill(undefined).map((_) => Array(cols).fill(undefined));
}

function toNumberPaths(cellPosPaths: CellPos[][], numCols: number): number[][] {
  return cellPosPaths.map(
    (path: CellPos[]) => path.map(
      (cp: CellPos) => cp.toNumber(numCols)));
}

describe('pathExists', () => {
  it('no path', () => {
    let towers = makeEmptyArray(2, 2);
    towers[0][1] = { id: 0 };
    towers[1][0] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    expect(
      pathExists(towersBgState, new CellPos(0, 0), new CellPos(1, 1)))
      .toEqual(false);
  });

  it('no path when start blocked', () => {
    let towers = makeEmptyArray(2, 2);
    towers[0][0] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    expect(
      pathExists(towersBgState, new CellPos(0, 0), new CellPos(1, 1)))
      .toEqual(false);
  });

  it('no path when end blocked', () => {
    let towers = makeEmptyArray(2, 2);
    towers[1][1] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    expect(
      pathExists(towersBgState, new CellPos(0, 0), new CellPos(1, 1)))
      .toEqual(false);
  });

  it('one step path', () => {
    let towers = makeEmptyArray(2, 2);
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    expect(
      pathExists(towersBgState, new CellPos(0, 0), new CellPos(0, 1)))
      .toEqual(true);
  });

  it('multistep path', () => {
    let towers = makeEmptyArray(2, 3);
    towers[0][1] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    expect(
      pathExists(towersBgState, new CellPos(0, 0), new CellPos(0, 2)))
      .toEqual(true);
  });

  it('multiple paths', () => {
    let towers = makeEmptyArray(3, 3);
    towers[1][1] = { id: 0 };
    const towersBgState: TowersBgState = {
      towers: towers,
    };

    expect(
      pathExists(towersBgState, new CellPos(0, 0), new CellPos(2, 2)))
      .toEqual(true);
  });

  it('many paths', () => {
    let towers = makeEmptyArray(3, 3);

    const towersBgState: TowersBgState = {
      towers: towers,
    };

    expect(
      pathExists(towersBgState, new CellPos(0, 0), new CellPos(2, 2)))
      .toEqual(true);
  });
});
