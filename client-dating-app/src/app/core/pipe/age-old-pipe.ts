import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageOld',
})
export class AgeOldPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (value) {
      const month = new Date(Date.now() - new Date(value).getTime());
      return Math.abs(month.getUTCFullYear() - 1970);
    } else {
      return 0;
    }
  }
}
