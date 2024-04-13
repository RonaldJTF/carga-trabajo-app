import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName'
})
export class FirstNamePipe implements PipeTransform {

  transform(nameIn: string, nameOut: string): string {
    if (nameIn != undefined && nameIn != ""){
      return nameIn.split(" ")[0];;
    }
    return nameOut;
  }

}
