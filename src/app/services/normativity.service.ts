import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Normativity, NormativityType } from '../models/normativity';

@Injectable({
  providedIn: 'root'
})
export class NormativityService {
  private pathNormativity: string = 'normativity'
  private pathNormativityType: string = 'normativity-type'

  constructor(
    private webRequestService: WebRequestService
  ) { }

  getNormativity(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathNormativity}/${id}`);
  }

  getNormativities(): Observable<Normativity[]>{
    return this.webRequestService.getWithHeaders(this.pathNormativity);
  }

  getFilteredNormativities(filter: {estado: '0'|'1', esEscalaSalarial: '0'|'1'}): Observable<Normativity[]>{
    return this.webRequestService.getWithHeaders(this.pathNormativity, filter);
  }

  createNormativity(normativity: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathNormativity, normativity);
  }

  updateNormativity(id: number, normativity: Normativity): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathNormativity}/${id}`, normativity);
  }

  deleteNormativity(idNormativity: number): Observable<Normativity> {
    return this.webRequestService.deleteWithHeaders(`${this.pathNormativity}/${idNormativity}`);
  }

  /*************************** TIPOS DE NORMATIVIDADES *******************************/
  getNormativityTypes(): Observable<NormativityType[]>{
    return this.webRequestService.getWithHeaders(this.pathNormativityType);
  }

}
