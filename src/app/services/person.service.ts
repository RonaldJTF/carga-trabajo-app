import {Injectable} from '@angular/core';
import {Person, Structure} from '@models';
import {Observable} from 'rxjs';
import {WebRequestService} from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private pathPerson = 'person';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

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

  deleteSelectedPeople(payload: number[]): Observable<Structure[]> {
    return this.webRequestService.deleteWithHeaders(this.pathPerson, undefined, payload);
  }
}
