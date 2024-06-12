import { Pipe, PipeTransform } from '@angular/core';
import { Methods } from '../../utils/methods';

@Pipe({
  name: 'prettyDate'
})
export class PrettyDatePipe implements PipeTransform {

  transform(input: string, type: 'datetime' | 'date' | 'time' | undefined): string {

    if (!/\d{2}:\d{2}:\d{2}/.test(input)) {
      input += ' 00:00:00';
    }

    const formatDateComponent = (component: number): string => {
      return component < 10 ? '0' + component : component.toString();
    }

    const date = new Date(input);
    const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const year = date.getFullYear();
    const month = date.getMonth();
    const day: any = formatDateComponent(date.getDate());
    const hour: any = formatDateComponent(date.getHours());
    const minute: any = formatDateComponent(date.getMinutes());
    const second: any = formatDateComponent(date.getSeconds());

    if (type == 'datetime' || !type){
      return `${day} de ${MONTHS[month]} de ${year} ${hour}:${minute}:${second}`;
    }else if (type == 'date'){
      return `${day} de ${MONTHS[month]} de ${year}`;
    }else if( type == 'time'){
      return `${hour}:${minute}:${second}`;
    }else{
      return '';
    }
  }
}
