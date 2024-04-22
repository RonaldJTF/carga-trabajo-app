import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

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
  
  private pathPerson = '/personas';
  private URLBASE: string = environment.URLAPI;

  httpOptions = httpOptions.headers.set('Authorization', 'my-new-auth-token');

  constructor(private http: HttpClient) {}

  getPeople(): Observable<Person[]> {
    return this.http
      .get(this.URLBASE.concat(this.pathPerson))
      .pipe(map((response) => response as Person[]));
  }

  getPerson(idPerson: number): Observable<Person> {
    return this.http
      .get<Person>(`${this.URLBASE.concat(this.pathPerson)}/${idPerson}`)
      .pipe(
        catchError((e) => {
          return throwError(() => new Error(e));
        })
      );
  }

  create(persona: Person): Observable<any> {
    return this.http
      .post<any>(`${this.URLBASE.concat(this.pathPerson)}`, persona, httpOptions)
      .pipe(
        catchError((e) => {
          return throwError(() => new Error(e));
        })
      );
  }

  update(id: string, persona: Person): Observable<any> {
    return this.http
      .put<Person>(`${this.pathPerson}/${id}`, persona, httpOptions)
      .pipe(
        catchError((e) => {
          return throwError(() => new Error(e));
        })
      );
  }

  delete(id: string): Observable<Person> {
    return this.http
      .delete<Person>(`${this.URLBASE.concat(this.pathPerson)}/${id}`, httpOptions)
      .pipe(
        catchError((e) => {
          return throwError(() => new Error(e));
        })
      );
  }

}
