import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";

export class ValidateRange {
  static validateBetween(minControlName: string, maxControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control.parent as FormGroup;

      const minValue = formGroup ? formGroup.get(minControlName)?.value : null;
      const maxValue = formGroup ? formGroup.get(maxControlName)?.value : null;
      
      if (control.value === undefined || control.value === null || control.value === '') {
        return null;
      } else if (typeof control.value === 'number' && (control.value >= minValue && control.value <= maxValue)) {
        return null;
      } else {
        return { invalidValue: true };
      }
    };
  }

  static validateLower(maxControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control.parent as FormGroup;

      const maxValue = formGroup ? formGroup.get(maxControlName)?.value : null;
      
      if (control.value === undefined || control.value === null || control.value === '' || maxValue == null) {
        return null;
      } else if (typeof control.value === 'number' && (control.value <= maxValue)) {
        return null;
      } else {
        return { invalidValue: true };
      }
    };
  }

  static validateUpper(minControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control.parent as FormGroup;

      const minValue = formGroup ? formGroup.get(minControlName)?.value : null;
      
      if (control.value === undefined || control.value === null || control.value === '' || minValue == null) {
        return null;
      } else if (typeof control.value === 'number' && (control.value >= minValue)) {
        return null;
      } else {
        return { invalidValue: true };
      }
    };
  }
}
