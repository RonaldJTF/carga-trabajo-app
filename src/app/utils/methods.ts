import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";
import { MenuItem } from "primeng/api";
import { MIMETYPE_TO_EXTENSION } from "./constants";

export class Methods {

  static parseStringToBoolean(s: string | undefined): boolean {
    if (s == '1') {
      return true;
    } else {
      return false;
    }
  }

  static parseBooleanToString(input: boolean | undefined): string {
    if (input) {
      return "1";
    } else {
      return "0";
    }
  }

  static generateRandomColor(): string {
    const colors = ["red", "blue", "green", "yellow", "orange", "purple"];
    return colors[Math.floor(Math.random() * colors.length)];
  }


  static clearValidatorsRecursively(control: AbstractControl) {
    if (control instanceof FormGroup || control instanceof FormArray) {
      const formGroup = control as FormGroup | FormArray;
      Object.keys(formGroup.controls).forEach((key) => {
        this.clearValidatorsRecursively(formGroup.get(key));
      });
    } else if (control instanceof FormControl) {
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  static hasErrors(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  static hasErrorsFormArray(formArray: FormArray): boolean {
    for (const control of formArray.controls) {
      const formGroup = control as FormGroup;
      if (formGroup.errors !== null) {
        return true;
      }
    }
    return false;
  }

  static formatToDateTime(date: Date) {
    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
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

    if (month < 10) {
      month = `0${month}`;
    }

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  static formatToString(date: Date, format: 'yyyy-mm-dd' | 'yyyy-mm-dd HH:MM:SS') {
    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
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

    if (month < 10) {
      month = `0${month}`;
    }

    if(format == 'yyyy-mm-dd'){
      return `${year}-${month}-${day}`;
    }
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  static getExtensionOfMimetype(mimetype: string) {
    return MIMETYPE_TO_EXTENSION[mimetype.toLowerCase()];
  }

  static lightenColor(color, factor) {
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    r = Math.min(255, Math.round(r + (255 - r) * factor));
    g = Math.min(255, Math.round(g + (255 - g) * factor));
    b = Math.min(255, Math.round(b + (255 - b) * factor));
    var newColor = '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    return newColor;
  }

  static darkenColor(color, factor) {
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
    var newColor = '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    return newColor;
  }

  static formatDateWithTimezone(date: Date) {
    const pad = (number: number) => number < 10 ? '0' + number : number;

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Obtener el desplazamiento de la zona horaria en minutos y convertirlo a formato ±HHmm
    const timezoneOffset = date.getTimezoneOffset();
    const offsetSign = timezoneOffset > 0 ? '-' : '+';
    const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
    const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

    const timezone = `${offsetSign}${offsetHours}${offsetMinutes}`;

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}`;
  };

  static getActivityStatus(startDate: Date, endDate: Date, completedDate:Date, advance: number){
    let actual = new Date();
    endDate.setTime(endDate.getTime() + (24 * 60 * 60 * 1000));//Para que el día termine a las 23:59:59 o antes de empezar el otro día
    if (advance >= 100){
      if(completedDate?.getTime() <= endDate.getTime()){
        return {classStyle: 'completed', value: 'Completada'};
      }else{
        return {classStyle: 'completed-late', value: 'Completada con atraso'};
      }
    }else{
      if (actual.getTime() > startDate.getTime() && actual.getTime() <= endDate.getTime()){
        return {classStyle: 'in-process', value: 'En proceso'};
      }else if (actual.getTime() < startDate.getTime()){
        return {classStyle: 'waiting', value: 'Pendiente'};
      }else if(actual.getTime() > endDate.getTime()){
        return {classStyle: 'delayed', value: 'Atrasada'};
      }
    }
    return {classStyle: 'unknown', value: 'Desconocido'};
  }

  static findMenuItemBy(menuItems: MenuItem[], value: any, key: any){
    const menuItem: MenuItem = menuItems.find(e => e[key] == value);
    if (menuItem){
      return menuItem;
    }
    for (const e of menuItems){
      if (e.items){
        return this.findMenuItemBy(e.items, value, key)
      }
    }
  }

  /**
   * Transforma, de una cadena de texto, la primera letra en mayuscula y el restos en miniscula.
   * @param text cadena de texto a modificar.
   */
  static capitalizeFirstLetter(text: string){
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
