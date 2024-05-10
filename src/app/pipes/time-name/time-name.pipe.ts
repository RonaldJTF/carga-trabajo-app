import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeName'
})
export class TimeNamePipe implements PipeTransform {
  transform(number: number | string, maximumLength: number, shortName: string, largeName: string): string {
    if (number){
      const length = number.toString().replace(/[.,']/g, '').length;
      if (length < maximumLength){
        return shortName;
      }
      return largeName;
    }else{
      return '';
    }
  }
}
