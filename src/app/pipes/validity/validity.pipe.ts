import { Pipe, PipeTransform } from '@angular/core';

class OutValidity{
  classStyle: string;
  value: string;
}

@Pipe({
  name: 'validity'
})
export class ValidityPipe implements PipeTransform {
  transform(stateIn: string): OutValidity {
    if (stateIn == "1" || stateIn == "true"){
      return {classStyle: 'active', value: 'Vigente'}
    }else if (stateIn == "0" || stateIn == "false"){
      return {classStyle: 'inactive', value: 'No vigente'}
    }
    return {classStyle: 'unknown', value: 'Desconocido'}
  }
}
