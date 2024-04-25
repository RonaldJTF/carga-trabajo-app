import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DocumentType } from '../models/documenttype';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  private pathTipoDocumento = 'document-type';

  constructor(
    private webRequestService: WebRequestService
  ) {}

  getDocumentType(): Observable<DocumentType[]> {
    return this.webRequestService.get(this.pathTipoDocumento);
    // return this.http.get(this.URLBASE.concat(this.pathTipoDocumento)).pipe(map((response) => response as DocumentType[]));
  }
}
