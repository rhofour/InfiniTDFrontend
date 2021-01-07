import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'goldNumber'
})
export class GoldNumberPipe implements PipeTransform {

  transform(value: number): string {
    const digits = Math.ceil(Math.log10(value));
    const suffixes = ["K", "M", "B", "T", "Q"];
    if (digits < 4) {
      return value.toFixed(1);
    }
    let logDenominator = 3;
    for (let suffix of suffixes) {
      if (digits < logDenominator + 4) {
        return (value / (10 ** logDenominator)).toPrecision(4).slice(0, 5) + suffix;
      }
      logDenominator += 3;
    }
    return value.toExponential(3);
  }

}
