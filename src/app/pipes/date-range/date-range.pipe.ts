import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRange'
})
export class DateRangePipe implements PipeTransform {

  transform(input: string[], type: 'datetime' | 'date' | 'time' | undefined): string {
    const formatDateComponent = (component: number): string => {
      return component < 10 ? '0' + component : component.toString();
    }
    
    const formatDate = (date: Date): { year: number, month: string, day: string, hour: string, minute: string, second: string } => {
      return {
        year: date.getFullYear(),
        month: MONTHS[date.getMonth()],
        day: formatDateComponent(date.getDate()),
        hour: formatDateComponent(date.getHours()),
        minute: formatDateComponent(date.getMinutes()),
        second: formatDateComponent(date.getSeconds())
      }
    }
    
    const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const [start, end] = input.map(date => /\d{2}:\d{2}:\d{2}/.test(date) ? date : `${date} 00:00:00`);
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startComponents = formatDate(startDate);
    const endComponents = formatDate(endDate);
    
    if (startComponents.year === endComponents.year) {
      if (type === 'datetime' || !type) {
        return `${startComponents.day} de ${startComponents.month} ${startComponents.hour}:${startComponents.minute}:${startComponents.second} al ${endComponents.day} de ${endComponents.month} ${endComponents.hour}:${endComponents.minute}:${endComponents.second} del ${startComponents.year}`;
      } else if (type === 'date') {
        return `${startComponents.day} de ${startComponents.month} al ${endComponents.day} de ${endComponents.month} del ${startComponents.year}`;
      } else if (type === 'time') {
        return `${startComponents.hour}:${startComponents.minute}:${startComponents.second} a ${endComponents.hour}:${endComponents.minute}:${endComponents.second}`;
      } else {
        return '';
      }
    } else {
      if (type === 'datetime' || !type) {
        return `${startComponents.day} de ${startComponents.month} del ${startComponents.year} ${startComponents.hour}:${startComponents.minute}:${startComponents.second} al ${endComponents.day} de ${endComponents.month} del ${endComponents.year} ${endComponents.hour}:${endComponents.minute}:${endComponents.second}`;
      } else if (type === 'date') {
        return `${startComponents.day} de ${startComponents.month} al ${endComponents.day} de ${endComponents.month} del ${startComponents.year}`;
      } else if (type === 'time') {
        return `${startComponents.hour}:${startComponents.minute}:${startComponents.second} hasta ${endComponents.hour}:${endComponents.minute}:${endComponents.second}`;
      } else {
        return '';
      }
    }
  }
}
