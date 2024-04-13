import { Pipe, PipeTransform } from '@angular/core';
import { ICONS_OF_FILE_TYPE_BY_EXTENSION, ICON_FILE_GENERAL } from '../../utils/constants';
import { Methods } from '../../utils/methods';

@Pipe({
  name: 'fileIcon'
})
export class FileIconPipe implements PipeTransform {

  transform(mimetype: string): string {
    return `assets/content/images/type of files/${ICONS_OF_FILE_TYPE_BY_EXTENSION[Methods.getExtensionOfMimetype(mimetype) ?? ''] ?? ICON_FILE_GENERAL }`;
  }


}
