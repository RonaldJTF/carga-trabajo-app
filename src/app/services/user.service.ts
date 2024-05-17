import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {Rol} from '../models/rol';
import {WebRequestService} from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private pathUser = 'user';
  private pathRole = 'role';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  loadRoles(): Observable<Rol[]> {
    return this.webRequestService.getWithHeaders(this.pathRole);
  }

  create(user: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathUser, user);
  }

  update(id: number, user: User): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathUser}/${id}`, user);
  }

  delete(id: number): Observable<User> {
    return this.webRequestService.deleteWithHeaders(`${this.pathUser}/${id}`);
  }
}
