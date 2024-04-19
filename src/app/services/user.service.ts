import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user';
import { RolesUser } from '../models/rolesuser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private pathUser = '/usuario';
  private URLBASE: string = environment.URLAPI;

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http
      .get(this.URLBASE.concat(this.pathUser))
      .pipe(map((response) => response as User));
  }

  getRolsUser(userId): Observable<RolesUser[]>{
      return this.http.get<any>(`${this.URLBASE.concat(this.pathUser)}/${userId}`).pipe(
        catchError((e) => {
          return throwError(() => new Error(e));
        })
      );
  }
}
