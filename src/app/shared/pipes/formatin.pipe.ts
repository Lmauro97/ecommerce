import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: any): any {
    if (value !== undefined && value !== null) {
      return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }
    return value;
  }
}
