import {Pipe, PipeTransform} from '@angular/core';
import {Methods} from '@utils';

@Pipe({
  name: 'darkenColor'
})
export class DarkenColorPipe implements PipeTransform {

  /**
   * Este pipe tranforma un color a su version mas oscura.
   * @param colorIn color que se quiere oscurecer.
   * @param factor factor de ocuridad del color.
   */
  transform(colorIn: string, factor?: number): string {
    if (colorIn != null) {
      return Methods.darkenColor(colorIn, factor ?? 0.5);
    }
    return '';
  }

}
