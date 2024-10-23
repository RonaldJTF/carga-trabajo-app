import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Person, Role, User} from '@models';
import {WebRequestService} from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private pathUser = 'user';
  private pathRole = 'role';
  private pathSendEmail = 'send-email';
  private pathValidatePassword = this.pathUser.concat("/validate-password");
  private pathUpdatePassword = this.pathUser.concat("/new-password");

  constructor(private webRequestService: WebRequestService) {
  }

  loadRoles(): Observable<string[]> {
    return this.webRequestService.getWithHeaders(this.pathRole);
  }

  create(user: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathUser, user);
  }

  update(id: string, user: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathUser}/${id}`, user);
  }

  delete(id: string): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathUser}/${id}`);
  }

  validatePassword(user: User): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathValidatePassword, user);
  }

  updatePassword(user: User): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathUpdatePassword, user);
  }

  recoverPasswor(person: Person): Observable<Person> {
    return this.webRequestService.putWithHeaders(`${this.pathSendEmail}`, person);

  }
}
