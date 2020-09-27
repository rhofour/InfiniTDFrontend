import { Component, OnInit } from '@angular/core';

import { CellPos } from '../types';
import { TowersBgState } from '../battleground-state';
import { findShortestPaths } from '../path';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.css']
})
export class BenchmarkComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  benchmark(name: string, iters: number, fn: () => void) {
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
        return;
      }
      durations[i] = measures[0].duration;
    }
    console.log('Timing for: ' + name);
    durations.sort()
    console.log(`Max: ${durations[durations.length-1]}ms\nMedian: ${durations[Math.floor(durations.length / 2)]}ms\nMin: ${durations[0]}ms`);
  }

  benchmarkPaths(): void {
    function makeEmptyArray(rows: number, cols: number) {
      return Array(rows).fill(undefined).map((_) => Array(cols).fill(undefined));
    }

    let empty5 = makeEmptyArray(5, 5);
    const empty5BgState: TowersBgState = {
      towers: empty5,
    };
    let empty7 = makeEmptyArray(7, 7);
    const empty7BgState: TowersBgState = {
      towers: empty7,
    };
    let empty10 = makeEmptyArray(10, 10);
    const empty10BgState: TowersBgState = {
      towers: empty10,
    };
    let empty12 = makeEmptyArray(12, 12);
    const empty12BgState: TowersBgState = {
      towers: empty12,
    };
    let empty15 = makeEmptyArray(15, 15);
    const empty15BgState: TowersBgState = {
      towers: empty15,
    };

    this.benchmark('Empty 5x5 straight', 10, function() {
      findShortestPaths(empty5BgState, new CellPos(0, 0), new CellPos(4, 0));
    })
    this.benchmark('Empty 10x10 straight', 10, function() {
      findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(9, 0));
    })
    this.benchmark('Empty 15x15 straight', 10, function() {
      findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(14, 0));
    })
    this.benchmark('Empty 5x5 diagonal', 10, function() {
      findShortestPaths(empty5BgState, new CellPos(0, 0), new CellPos(4, 4));
    })
    this.benchmark('Empty 7x7 diagonal', 10, function() {
      findShortestPaths(empty7BgState, new CellPos(0, 0), new CellPos(6, 6));
    })
    this.benchmark('Empty 10x10 diagonal', 10, function() {
      findShortestPaths(empty10BgState, new CellPos(0, 0), new CellPos(9, 9));
    })
    this.benchmark('Empty 12x12 diagonal', 5, function() {
      findShortestPaths(empty12BgState, new CellPos(0, 0), new CellPos(11, 11));
    })
  }

}
