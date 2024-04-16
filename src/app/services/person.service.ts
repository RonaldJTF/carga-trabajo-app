import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  pathPerson = "personas";
  URLBASE: string = environment.URLAPI;

  constructor(private http: HttpClient) { }

  getPeople(): Observable<Person[]> {
    return this.http
      .get(this.URLBASE+this.pathPerson)
      .pipe(map((response) => response as Person[]));
  }
}
