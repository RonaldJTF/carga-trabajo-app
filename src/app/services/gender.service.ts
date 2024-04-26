import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Gender } from '../models/gender';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private pathTipoDocumento = 'gender';

  constructor(
    private webRequestService: WebRequestService
  ) {}

  getDocumentType(): Observable<Gender[]> {
    return this.webRequestService.get(this.pathTipoDocumento);
    // return this.http.get(this.URLBASE.concat(this.pathTipoDocumento)).pipe(map((response) => response as DocumentType[]));
  }
}
