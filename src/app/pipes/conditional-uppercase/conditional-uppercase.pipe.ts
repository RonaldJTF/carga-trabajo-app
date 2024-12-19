import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conditionalUppercase'
})
export class ConditionalUppercasePipe implements PipeTransform {

  transform(input: string, conditional: boolean): string {
    if (conditional && input){
      return input.toUpperCase();
    }
    return input;
  }

}
