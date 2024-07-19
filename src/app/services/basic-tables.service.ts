import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {Observable} from "rxjs";
import {Role} from "../models/role";
import {Gender} from "../models/gender";
import {Level} from "../models/level";

@Injectable({
  providedIn: 'root'
})
export class BasicTablesService {

  private pathRole = 'role';

  private pathGender = 'gender';

  private pathLevel = 'nivel';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  // Servicios ROL
  getRoles(): Observable<Role[]> {
    return this.webRequestService.getWithHeaders(this.pathRole);
  }

  getRole(idRol: number): Observable<Role> {
    return this.webRequestService.getWithHeaders(`${this.pathRole}/${idRol}`);
  }

  createRole(rol: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathRole, rol);
  }

  updateRole(id: number, rol: Role): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathRole}/${id}`, rol);
  }

  deleteRole(idRol: number): Observable<Role> {
    return this.webRequestService.deleteWithHeaders(`${this.pathRole}/${idRol}`);
  }

  deleteSelectedRole(payload: number[]): Observable<Role[]> {
    return this.webRequestService.deleteWithHeaders(this.pathRole, undefined, payload);
  }

  // Servicios GENERO
  getGenders(): Observable<Gender[]> {
    return this.webRequestService.getWithHeaders(this.pathGender);
  }

  getGender(genderId): Observable<Gender> {
    return this.webRequestService.getWithHeaders(`${this.pathGender}/${genderId}`);
  }

  createGender(gender: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathGender, gender);
  }

  updateGender(id: number, gender: Gender): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathGender}/${id}`, gender);
  }

  deleteGender(idGender: number): Observable<Gender> {
    return this.webRequestService.deleteWithHeaders(`${this.pathGender}/${idGender}`);
  }

  deleteSelectedGender(payload: number[]): Observable<Gender[]> {
    return this.webRequestService.deleteWithHeaders(this.pathGender, undefined, payload);
  }

  // Servicios NIVEL
  getLevels(): Observable<Level[]> {
    return this.webRequestService.getWithHeaders(this.pathLevel);
  }

  getLevel(levelId): Observable<Level> {
    return this.webRequestService.getWithHeaders(`${this.pathLevel}/${levelId}`);
  }

  createLevel(level: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathLevel, level);
  }

  updateLevel(id: number, gender: Level): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathLevel}/${id}`, gender);
  }

  deleteLevel(idLevel: number): Observable<Level> {
    return this.webRequestService.deleteWithHeaders(`${this.pathLevel}/${idLevel}`);
  }

  deleteSelectedLevel(payload: number[]): Observable<Level[]> {
    return this.webRequestService.deleteWithHeaders(this.pathLevel, undefined, payload);
  }
}
