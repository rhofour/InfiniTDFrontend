import { Benchmark } from 'benchmark';

import { CellPos } from './types';
import { TowersBgState } from './battleground-state';
import { findShortestPaths } from './path';

function makeEmptyArray(rows: number, cols: number) {
  return Array(rows).fill(undefined).map((_) => Array(cols).fill(undefined));
}

var suite = new Benchmark.Suite;

let empty5 = makeEmptyArray(5, 5);
const empty5BgState: TowersBgState = {
  towers: empty5,
};
let empty10 = makeEmptyArray(10, 10);
const empty10BgState: TowersBgState = {
  towers: empty10,
};

suite.add('Empty 10x10 straight', function() {
  findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(9, 0));
})
suite.add('Empty 5x5 diagonal', function() {
  findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(4, 4));
})
suite.add('Empty 10x10 diagonal', function() {
  findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(9, 9));
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
// run async
.run({'async': true });
