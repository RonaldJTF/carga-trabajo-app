import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { WebRequestService } from './web-request.service';
import {Structure} from "../models/structure";

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private pathPerson = 'person';
  private URLBASE: string = environment.URLAPI;

  constructor(
    private http: HttpClient,
    private webRequestService: WebRequestService
  ) {}

  getPeople(): Observable<Person[]> {
    return this.webRequestService.getWithHeaders(this.pathPerson);
  }

  getPerson(idPerson: number): Observable<Person> {
    return this.webRequestService.getWithHeaders(`${this.pathPerson}/${idPerson}`);
  }

  create(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathPerson, payload);
  }

  update(idPerson: number, payload: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathPerson}/${idPerson}`, payload);
  }

  delete(id: number): Observable<Person> {
    return this.webRequestService.deleteWithHeaders(`${this.pathPerson}/${id}`);
  }

  deleteSelectedPeople(payload: number[]):  Observable<Structure[]> {
    return this.webRequestService.deleteWithHeaders(this.pathPerson, undefined, payload);
  }
}
