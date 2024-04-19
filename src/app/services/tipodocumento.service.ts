import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { TipoDocumento } from '../models/tipodocumento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  pathTipoDocumento = "/tiposdocumentos";
  URLBASE: string = environment.URLAPI;

  constructor(private http: HttpClient) { }

  getTipoDocumentos(): Observable<TipoDocumento[]> {
    return this.http.get(this.URLBASE.concat(this.pathTipoDocumento)).pipe(map((response) => response as TipoDocumento[]));
  }
}
