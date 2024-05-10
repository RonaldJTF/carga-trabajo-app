import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user';
import { RolesUser } from '../models/rolesuser';
import { Rol } from '../models/rol';
import { Person } from '../models/person';
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
export class UserService {
  private pathUser = 'user';
  private pathRole = 'role';

  private URLBASE: string = environment.URLAPI;

  httpOptions = httpOptions.headers.set('Authorization', 'my-new-auth-token');

  constructor(
    private http: HttpClient,
    private webRequestService: WebRequestService
  ) {}

  getUser(): Observable<User> {
    return this.http
      .get(this.URLBASE.concat(this.pathUser))
      .pipe(map((response) => response as User));
  }

  getRolsUser(userId): Observable<RolesUser[]> {
    return this.http
      .get<any>(`${this.URLBASE.concat(this.pathUser)}/${userId}`)
      .pipe(
        catchError((e) => {
          return throwError(() => new Error(e));
        })
      );
  }

  loadRoles(): Observable<Rol[]> {
    return this.webRequestService.getWithHeaders(this.pathRole);
  }

  create(user: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathUser, user);
  }

  update(id: number, user: User): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathUser}/${id}`, user)
    // return this.http
    //   .put<Person>(`${this.pathUser}/${id}`, user, httpOptions)
    //   .pipe(
    //     catchError((e) => {
    //       return throwError(() => new Error(e));
    //     })
    //   );
  }

  delete(id: number): Observable<User> {
    return this.webRequestService.deleteWithHeaders(`${this.pathUser}/${id}`)
    // return this.http
    //   .delete<User>(`${this.URLBASE.concat(this.pathUser)}/${id}`, httpOptions)
    //   .pipe(
    //     catchError((e) => {
    //       return throwError(() => new Error(e));
    //     })
    //   );
  }
}
