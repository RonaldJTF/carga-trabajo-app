import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable, of } from 'rxjs';
import { Structure } from '../models/structure';
import { HttpResponse } from '@angular/common/http';
import { structuresOfMock } from '../mock-data/structures';

@Injectable({
  providedIn: 'root'
})
export class StructureService {
  private pathStructure: string = '/structure'

  structuresOfMock: Structure[] = structuresOfMock;

  constructor(
    private webRequestService: WebRequestService
  ) { }


  getStructures(): Observable<Structure[]>{
    return new Observable<Structure[]>(observer => {
      setTimeout(() => {
        observer.next(this.structuresOfMock);
        observer.complete();
      }, 3000);
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
