import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";
import { all, create} from 'mathjs';

export class ValidateExpression {
  static validate(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      
      if (!value || typeof value !== 'string' ||  !value.trim()) {
        return { invalid: true};
      }
      try {
        const math = create(all);
        const node = math.parse(value);
        return null; 
      } catch {
        return { invalid: true};
      }
    };
  }
}
