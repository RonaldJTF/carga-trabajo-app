import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(input: string): string {
    const date = new Date(input);
    const millisecondsDiff = new Date().getTime() - date.getTime();

    const secondsDiff = Math.floor(millisecondsDiff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);
    const monthsDiff = Math.floor(daysDiff / 30);
    const yearsDiff = Math.floor(daysDiff / 365);

    if (secondsDiff < 60) {
      return 'Hace un momento';
    } else if (minutesDiff < 60) {
      return `Hace ${minutesDiff} minuto${minutesDiff !== 1 ? 's' : ''}`;
    } else if (hoursDiff < 24) {
      return `Hace ${hoursDiff} hora${hoursDiff !== 1 ? 's' : ''}`;
    } else if (daysDiff < 30) {
      return `Hace ${daysDiff} día${daysDiff !== 1 ? 's' : ''}`;
    } else if (monthsDiff < 12) {
      return `Hace ${monthsDiff} mes${monthsDiff !== 1 ? 'es' : ''}`;
    } else {
      return `Hace ${yearsDiff} año${yearsDiff !== 1 ? 's' : ''}`;
    }

  }
}
