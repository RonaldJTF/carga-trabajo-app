import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DocumentType } from '../models/documenttype';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  private pathTipoDocumento = "/tiposdocumentos";
  private URLBASE: string = environment.URLAPI;

  constructor(private http: HttpClient) { }

  getDocumentType(): Observable<DocumentType[]> {
    return this.http.get(this.URLBASE.concat(this.pathTipoDocumento)).pipe(map((response) => response as DocumentType[]));
  }
}
