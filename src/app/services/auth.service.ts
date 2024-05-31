import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  pathAuth = "auth/authenticate";
  lastUrl: string = "/";

  private loguedPerson_: BehaviorSubject<Person> = new BehaviorSubject(null);
  loguedPerson$: Observable<Person> = this.loguedPerson_.asObservable();

  constructor(
    private webRequestService: WebRequestService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService
  ) {
      this.loguedPerson_.next(this.storageService.getSessionStorage('mySelf') || this.storageService.getLocalStorage("mySelf"))
  }

  getIdUsuario(): number{
    return (this.loguedPerson_.value as Person).usuario.id;
  }

  login(payload: { username: string; password: string },tenant?: string): Observable<any> {
    tenant = tenant ? tenant : "tenant_001";
    const headers = { "X-Tenant-Id": tenant };
    return this.webRequestService.postWithoutToken(
      this.pathAuth,
      payload,
      headers
    ).pipe(
      map( e => {
        this.loguedPerson_.next(e.persona);
        return e;
      })
    );
  }

  getDecodedAccessToken(token: string): any {
    try {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const decodedToken: any = jwt_decode(token);
      if (decodedToken.exp < currentTime) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sesión finalizada',
            detail: 'Tu sesión ha finalizado. Por favor, vuelve a iniciar sesión.',
            life: 3000
          })
          this.logout()
        return; // El token ha expirado
      } else {
        return decodedToken;
      }
    } catch (Error) {
      return null;
    }
  }

  getRoleUser(): string | null {
    const token: string =
      this.storageService.getLocalStorage("token") ||
      this.storageService.getSessionStorage("token");
    if (token) {
      const { authorities } = this.getDecodedAccessToken(token);
      return authorities[0].authority;
    }
    return null;
  }

  getRolesUser(): string[] | null {
    const token: string = this.storageService.getLocalStorage("token") || this.storageService.getSessionStorage("token");
    if (token) {
      const { authorities } = this.getDecodedAccessToken(token);
      return authorities.map(e => e.authority);
    }
    return null;
  }

  logout() {
    //this.storageService.clearLocalStorage();
    this.storageService.clearSessionStorage();
    this.loguedPerson_.next(null);
    this.lastUrl = this.router.url;
    this.router.navigate(["/account/auth/login"]);
  }

  roleIsAdministrator(): boolean{
    return  this.getRolesUser().includes("ROLE_ADMINISTRADOR");
  }

  roleIsOperator(): boolean{
    return  this.getRolesUser().includes("ROLE_OPERADOR");
  }

}
