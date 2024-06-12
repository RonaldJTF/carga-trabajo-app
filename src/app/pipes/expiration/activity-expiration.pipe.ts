import { Pipe, PipeTransform } from '@angular/core';
import { Methods } from 'src/app/utils/methods';

export class Out{
  classStyle: string;
  value: string;
}

@Pipe({
  name: 'activityExpiration'
})
export class ActivityExpirationPipe implements PipeTransform {
  transform(input: string[], avance: number): Out {
    const start = new Date(input[0]);
    const end = new Date(input[1]);
    const completed = new Date(input[2]);
    return Methods.getActivityStatus(start, end, completed, avance);
  }
}
