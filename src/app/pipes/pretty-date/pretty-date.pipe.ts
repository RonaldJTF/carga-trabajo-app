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

    const date = new Date(input);
    const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const year = date.getFullYear();
    const month = date.getMonth();
    let day: any = date.getDate();
    let hour: any = date.getHours();
    let minute: any = date.getMinutes();
    let second: any = date.getSeconds();

    if (second < 10) {
      second = '0' + second;
    }

    if (minute < 10) {
      minute = '0' + minute;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }

    if (day < 10) {
      day = '0' + day;
    }
    
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
