import {AbstractControl, FormArray, FormControl, FormGroup} from "@angular/forms";

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

  static getExtensionOfMimetype(mimetype: string) {
    const parts = mimetype.split('/');
    if (parts.length === 2) {
      return parts[1];
    }
    return null;
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
}
