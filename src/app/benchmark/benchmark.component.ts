import { Component, OnInit } from '@angular/core';

import { CellPos } from '../types';
import { TowersBgState, TowerBgState } from '../battleground-state';
import { findShortestPaths } from '../path';

interface BenchmarkStats {
  max: number,
  median: number,
  min: number,
}

class BenchmarkAccumulator {
  maxs: number[] = [];
  medians: number[] = [];
  mins: number[] = [];

  add(stats: BenchmarkStats | undefined) {
    if (stats === undefined) {
      console.warn('Recieved undefined stats.');
      return;
    }
    this.maxs.push(stats.max);
    this.medians.push(stats.median);
    this.mins.push(stats.min);
  }

  logCsv() {
    console.log('Max: ' + this.maxs.join());
    console.log('Median: ' + this.medians.join());
    console.log('Min: ' + this.mins.join());
  }
}

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.css']
})
export class BenchmarkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  benchmark(name: string, iters: number, fn: () => void): BenchmarkStats | undefined {
    // Cleanup existing marks and measures before starting
    performance.clearMarks();
    performance.clearMeasures();

    let durations: number[] = Array(iters);
    for (let i = 0; i < iters; i++) {
      const markName = `${name}_${i}_start`;
      performance.mark(markName);
      fn();
      const measureName = `${name}_${i}`;
      performance.measure(measureName, `${name}_${i}_start`);

      const measures = performance.getEntriesByName(measureName);
      if (measures.length !== 1) {
        console.warn(`Expected one measure named ${measureName}, found: ${measures.length}`);
        console.warn(measures);
        return undefined;
      }
      durations[i] = measures[0].duration;
    }
    console.log('Timing for: ' + name);
    durations.sort((a: number, b: number) => a - b)
    const stats: BenchmarkStats = {
      max: durations[durations.length-1],
      median: durations[Math.floor(durations.length / 2)],
      min: durations[0],
    };
    console.log(`Max: ${stats.max} ms\nMedian: ${stats.median} ms\nMin: ${stats.min} ms`);
    return stats;
  }

  benchmarkPaths(): void {
    function makeEmptyBgState(rows: number, cols: number): TowersBgState {
      const arr: (TowerBgState | undefined)[][] = Array(rows).fill(undefined).map((_) => Array(cols).fill(undefined));
      return { towers: arr };
    }
    function make2ColBgState(rows: number, cols: number): TowersBgState {
      let arr = Array(rows).fill(undefined).map((_) => Array(cols).fill(undefined));
      // Add the first column of towers.
      for (let i = 0; i < rows - 2; i++) {
        arr[i][1] = { id: 0 };
      }
      // Add the second column of towers.
      for (let i = 1; i < rows; i++) {
        arr[i][3] = { id: 0 };
      }
      // Add the bottom row.
      for (let i = 0; i < 3; i++) {
        arr[rows - 2][i] = { id: 0 };
      }
      return { towers: arr };
    }

    const empty5BgState = makeEmptyBgState(5, 5);
    const empty7BgState = makeEmptyBgState(7, 7);
    const empty10BgState = makeEmptyBgState(10, 10);
    const empty12BgState = makeEmptyBgState(12, 12);
    const empty15BgState = makeEmptyBgState(15, 15);
    const twoCol10BgState = make2ColBgState(10, 10);
    const twoCol15BgState = make2ColBgState(15, 15);

    let acc = new BenchmarkAccumulator();
    acc.add(
      this.benchmark('Empty 5x5 straight', 25, function() {
        findShortestPaths(empty5BgState, new CellPos(0, 0), new CellPos(4, 0), false);
      }));
    acc.add(
      this.benchmark('Empty 10x10 straight', 25, function() {
        findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(9, 0), false);
      }));
    acc.add(
      this.benchmark('Empty 15x15 straight', 25, function() {
        findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(14, 0), false);
      }));
    acc.add(
      this.benchmark('2 Col 10x10 straight', 25, function() {
        findShortestPaths(twoCol10BgState, new CellPos(0, 0), new CellPos(9, 0), false);
      }));
    acc.add(
      this.benchmark('2 Col 15x15 straight', 25, function() {
        findShortestPaths(twoCol15BgState, new CellPos(0, 0), new CellPos(14, 0), false);
      }));
    acc.add(
      this.benchmark('Empty 5x5 diagonal', 25, function() {
        findShortestPaths(empty5BgState, new CellPos(0, 0), new CellPos(4, 4), false);
      }));
    acc.add(
      this.benchmark('Empty 7x7 diagonal', 25, function() {
        findShortestPaths(empty7BgState, new CellPos(0, 0), new CellPos(6, 6), false);
      }));
    acc.add(
      this.benchmark('Empty 10x10 diagonal', 25, function() {
        findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(9, 9), false);
      }));
    acc.add(
      this.benchmark('Empty 12x12 diagonal', 5, function() {
        findShortestPaths(empty12BgState, new CellPos(0, 0), new CellPos(11, 11), false);
      }));
    acc.logCsv();
  }
}
