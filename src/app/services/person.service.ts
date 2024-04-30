import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { WebRequestService } from './web-request.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private pathPerson = 'person';
  private URLBASE: string = environment.URLAPI;

  httpOptions = httpOptions.headers.set('Authorization', 'my-new-auth-token');

  constructor(
    private http: HttpClient,
    private webRequestService: WebRequestService
  ) {}

  getPeople(): Observable<Person[]> {
    return this.webRequestService.getWithHeaders(this.pathPerson);
    // return this.http
    //   .get(this.URLBASE.concat(this.pathPerson))
    //   .pipe(map((response) => response as Person[]));
  }

  getPerson(idPerson: number): Observable<Person> {
    return this.webRequestService.getWithHeaders(`${this.pathPerson}/${idPerson}`);
    // return this.http
    //   .get<Person>(`${this.URLBASE.concat(this.pathPerson)}/${idPerson}`)
    //   .pipe(
    //     catchError((e) => {
    //       return throwError(() => new Error(e));
    //     })
    //   );
  }

  create(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathPerson, payload)
    // return this.http
    //   .post<any>(
    //     `${this.URLBASE.concat(this.pathPerson)}`,
    //     payload,
    //     httpOptions
    //   )
    //   .pipe(
    //     catchError((e) => {
    //       return throwError(() => new Error(e));
    //     })
    //   );
  }

  update(idPerson: number, payload: any): Observable<any> {
    return this.webRequestService.put(`${this.pathPerson}/${idPerson}`, payload)
    // return this.http
    //   .put<Person>(`${this.pathPerson}/${id}`, persona, httpOptions)
    //   .pipe(
    //     catchError((e) => {
    //       return throwError(() => new Error(e));
    //     })
    //   );
  }

  delete(id: number): Observable<Person> {
    return this.webRequestService.deleteWithHeaders(`${this.pathPerson}/${id}`)
    // return this.http
    //   .delete<Person>(
    //     `${this.URLBASE.concat(this.pathPerson)}/${id}`,
    //     httpOptions
    //   )
    //   .pipe(
    //     catchError((e) => {
    //       return throwError(() => new Error(e));
    //     })
    //   );
  }
}
