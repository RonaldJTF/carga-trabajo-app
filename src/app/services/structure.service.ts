import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { map, Observable, of } from 'rxjs';
import { Structure } from '../models/structure';
import { HttpResponse } from '@angular/common/http';
import { structureRegistroYControl, structuresOfMock } from '../mock-data/structures';

@Injectable({
  providedIn: 'root'
})
export class StructureService {

  private pathStructure: string = 'structure'

  structuresOfMock: Structure[] = structuresOfMock;

  constructor(
    private webRequestService: WebRequestService
  ) { }


  getStructureById(id: number) {
    return new Observable<Structure>(observer => {
      setTimeout(() => {
        observer.next(structureRegistroYControl);
        observer.complete();
      }, 1000);
    });
  }

  getStructures(): Observable<Structure[]>{
    return this.webRequestService.get(this.pathStructure)
    // return new Observable<Structure[]>(observer => {
    //   setTimeout(() => {
    //     observer.next(this.structuresOfMock);
    //     observer.complete();
    //   }, 1000);
    // });
  }

  createStructure (payload: any) : Observable<HttpResponse<any>> {
    //return this.webRequestService.postWithHeaders(this.pathStructure, payload)
    return new Observable<any>(observer => {
      setTimeout(() => {
        observer.next(payload);
        observer.complete();
      }, 1000);
    });
  }

  updateStructure (id: number, payload: any) : Observable<HttpResponse<any>> {
    //return this.webRequestService.putWithHeaders(`${this.pathStructure}/${id}`, payload);
    return new Observable<any>(observer => {
      setTimeout(() => {
        observer.next(payload);
        observer.complete();
      }, 1000);
    });
  }

  deleteSelectedStrustures(structures: Structure[]):  Observable<Structure[]> {
    const payload = structures
                    .filter(objeto => objeto.selected == true)
                    .map(objeto => ({ id: objeto.id }));
    return of(payload)
    //return this.webRequestService.deleteWithHeaders(`${this.pathStructure}`, undefined, payload);
  }

  deleteStructure (id: number) : Observable<HttpResponse<any>> {
    return new Observable<any>(observer => {
      setTimeout(() => {
        observer.next();
        observer.complete();
      }, 1000);
    });
    //return this.webRequestService.deleteWithHeaders(`${this.pathStructure}/${id}`)
  }

}
