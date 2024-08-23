import { Pipe, PipeTransform } from '@angular/core';

export class OutState{
  classStyle: string;
  value: string;
}

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(stateIn: string): OutState {
    if (stateIn == "1" || stateIn == "true"){
      return {classStyle: 'active', value: 'Activo'}
    }else if (stateIn == "0" || stateIn == "false"){
      return {classStyle: 'inactive', value: 'Inactivo'}
    }
    return {classStyle: 'unknown', value: 'Desconocido'}
  }
}
