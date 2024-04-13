import { Pipe, PipeTransform } from '@angular/core';

export class Out{
  classStyle: string;
  value: string;
}

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(stateIn: string): Out {
    if (stateIn == "1"){
      return {classStyle: 'active', value: 'Activo'}
    }else if (stateIn == "0"){
      return {classStyle: 'inactive', value: 'Inactivo'}
    }
    return {classStyle: 'unknown', value: 'Desconocido'}
  }

}
