import { Pipe, PipeTransform } from '@angular/core';
import { Pluralize } from 'src/app/utils/pluralize';



@Pipe({
  name: 'pluralize'
})
export class PluralizePipe implements PipeTransform {
  transform(word: string, quantity?: number ): unknown {
    if (word != null){
      return Pluralize.transform(word, quantity);
    }
    return '';
  }

}
