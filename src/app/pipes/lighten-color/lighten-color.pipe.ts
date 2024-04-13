import { Pipe, PipeTransform } from '@angular/core';
import { Methods } from '../../utils/methods';

@Pipe({
  name: 'lightenColor'
})
export class LightenColorPipe implements PipeTransform {

  transform(colorIn: string): string {
    if (colorIn != null){
      return Methods.lightenColor(colorIn, 0.5);
    }
    return '';
  }

}
