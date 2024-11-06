import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter'
})
export class CapitalizeFirstLetterPipe implements PipeTransform {

  /**
   * Este método toma una cadena de texto como parámetro y devuelve la misma cadena con la primera letra de cada palabra en mayúscula y el resto en minúscula.
   * @param value texto que se quiere transformar.
   */
  transform(value: string): string {
    if (!value) return value;
    return value.toLowerCase().replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
  }

}
