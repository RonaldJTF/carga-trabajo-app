import { Pipe, PipeTransform } from '@angular/core';
import { Methods } from '../../utils/methods';

@Pipe({
  name: 'darkenColor'
})
export class DarkenColorPipe implements PipeTransform {

  transform(colorIn: string): string {
    if (colorIn != null){
      return Methods.darkenColor(colorIn, 0.5);
    }
    return '';
  }

}
