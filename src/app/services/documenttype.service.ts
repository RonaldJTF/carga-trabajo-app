import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DocumentType} from '@models';
import {WebRequestService} from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  private pathTipoDocumento = 'document-type';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getDocumentType(): Observable<DocumentType[]> {
    return this.webRequestService.getWithHeaders(this.pathTipoDocumento);
  }
}
