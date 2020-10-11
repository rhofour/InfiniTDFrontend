import { Component, OnInit } from '@angular/core';

import { CellPos } from '../types';
import { TowersBgState, TowerBgState } from '../battleground-state';

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
}
