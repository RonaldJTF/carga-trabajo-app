import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(sizeIn: string, sizeOut: string): string {
    const value = parseInt(sizeIn);
    if (value < 1000){
      return sizeIn + " B"
    }else if (value >= 1000 && value  < 1000000){
      return (value/1000).toFixed(2) + " Kb"
    }else if (value >= 1000000 && value  < 1000000000){
      return (value/1000000).toFixed(2) + " Mb"
    }else if (value >= 1000000000 && value  < 1000000000000){
      return (value/1000000000).toFixed(2) + " Gb"
    }else if (value >= 1000000000000 && value  < 1000000000000000){
      return (value/1000000000000).toFixed(2) + " Tb"
    }
    return sizeOut;
  }


}
