import { Pipe, PipeTransform } from '@angular/core';

export class Out{
  classStyle: string;
  value: string;
}

@Pipe({
  name: 'activityExpiration'
})
export class ActivityExpirationPipe implements PipeTransform {
  transform(input: string[], avance: number): Out {
    const actualDate = new Date();
    const dateStart = new Date(input[0]);
    const dateEnd = new Date(input[1]);
    if (actualDate.getTime() >= dateStart.getTime() && actualDate.getTime() <= dateEnd.getTime()){
      return {classStyle: 'in-process', value: 'En proceso'};
    }else if (actualDate.getTime() > dateEnd.getTime()){
      if(avance >= 100){
        return {classStyle: 'completed', value: 'Completada'};
      }
      return {classStyle: 'delayed', value: 'Atrasada'};
    }else if (actualDate.getTime() < dateStart.getTime()){
      return {classStyle: 'waiting', value: 'Pendiente'};
    }
    return {classStyle: 'unknown', value: 'Desconocido'};
  }
}
