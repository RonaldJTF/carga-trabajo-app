import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {Observable} from "rxjs";
import {Action, Ftp, Gender, Level, Role, Typology, DocumentType, Scope, Category, Periodicity, Normativity, NormativityType} from "@models";

@Injectable({
  providedIn: 'root'
})
export class BasicTablesService {

  private pathRole = 'role';

  private pathGender = 'gender';

  private pathLevel = 'level';

  private pathTypology = 'typology';

  private pathFtp = 'ftp';

  private pathAction = 'action';

  private pathTypologyAction = 'typology-action';

  private pathDocumentType = 'document-type';

  private pathScope = 'scope';

  private pathCategory = 'category';

  private pathPeriodicity = 'periodicity';

  private pathNormativityType = 'normativity-type';

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

  getGender(idGender: number): Observable<Gender> {
    return this.webRequestService.getWithHeaders(`${this.pathGender}/${idGender}`);
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

  getLevel(idLevel: number): Observable<Level> {
    return this.webRequestService.getWithHeaders(`${this.pathLevel}/${idLevel}`);
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

  // Servicios TIPOLOGIAS
  getTypoligies(): Observable<Typology[]> {
    return this.webRequestService.getWithHeaders(this.pathTypology);
  }

  getTypology(idTypology: number): Observable<Typology> {
    return this.webRequestService.getWithHeaders(`${this.pathTypology}/${idTypology}`);
  }

  createTypology(typology: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathTypology, typology);
  }

  updateTypology(id: number, typology: Typology): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathTypology}/${id}`, typology);
  }

  deleteTypology(idTypology: number): Observable<Typology> {
    return this.webRequestService.deleteWithHeaders(`${this.pathTypology}/${idTypology}`);
  }

  deleteSelectedTypologies(payload: number[]): Observable<Typology[]> {
    return this.webRequestService.deleteWithHeaders(this.pathTypology, undefined, payload);
  }

  // Servicios FTP
  getFtps(): Observable<Ftp[]> {
    return this.webRequestService.getWithHeaders(this.pathFtp);
  }

  getFtp(idFtp: number): Observable<Ftp> {
    return this.webRequestService.getWithHeaders(`${this.pathFtp}/${idFtp}`);
  }

  createFtp(ftp: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathFtp, ftp);
  }

  updateFtp(id: number, ftp: Ftp): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathFtp}/${id}`, ftp);
  }

  deleteFtp(idFtp: number): Observable<Ftp> {
    return this.webRequestService.deleteWithHeaders(`${this.pathFtp}/${idFtp}`);
  }

  deleteSelectedFtps(payload: number[]): Observable<Ftp[]> {
    return this.webRequestService.deleteWithHeaders(this.pathFtp, undefined, payload);
  }

  // Servicios ACCION
  getActions(): Observable<Action[]> {
    return this.webRequestService.getWithHeaders(this.pathAction);
  }

  getAction(idAction: number): Observable<Action> {
    return this.webRequestService.getWithHeaders(`${this.pathAction}/${idAction}`);
  }

  createAction(action: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathAction, action);
  }

  updateAction(id: number, action: Action): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathAction}/${id}`, action);
  }

  deleteAction(idAction: number): Observable<Action> {
    return this.webRequestService.deleteWithHeaders(`${this.pathAction}/${idAction}`);
  }

  deleteSelectedActions(payload: number[]): Observable<Action[]> {
    return this.webRequestService.deleteWithHeaders(this.pathAction, undefined, payload);
  }

  // Servicios TIPOLOGIA-ACCION
  getTypologyActions(): Observable<Action[]> {
    return this.webRequestService.getWithHeaders(this.pathTypologyAction);
  }

  getTypologyAction(idAction: number): Observable<Action> {
    return this.webRequestService.getWithHeaders(`${this.pathTypologyAction}/${idAction}`);
  }

  createTypologyAction(idTypology: number, action: any): Observable<any> {
    return this.webRequestService.postWithHeaders(`${this.pathTypologyAction}/${idTypology}`, action);
  }

  updateTypologyAction(id: number, action: Action): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathTypologyAction}/${id}`, action);
  }

  deleteTypologyAction(idTypology: number, idAction: number): Observable<Action> {
    return this.webRequestService.deleteWithHeaders(this.pathTypologyAction, undefined, {
      idTipologia: idTypology,
      idAccion: idAction
    });

  }

  deleteSelectedTypologyActions(idTypology: number, payload: number[]): Observable<Action[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathTypologyAction}/${idTypology}`, undefined, payload);
  }

  // Servicios DOCUMENTTYPE
  getDocumentsType(): Observable<DocumentType[]> {
    return this.webRequestService.getWithHeaders(this.pathDocumentType);
  }

  getDocumentType(idDocumentType: number): Observable<DocumentType> {
    return this.webRequestService.getWithHeaders(`${this.pathDocumentType}/${idDocumentType}`);
  }

  createDocumentType(documentType: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathDocumentType, documentType);
  }

  updateDocumentType(id: number, documentType: DocumentType): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathDocumentType}/${id}`, documentType);
  }

  deleteDocumentType(idDocumentType: number): Observable<DocumentType> {
    return this.webRequestService.deleteWithHeaders(`${this.pathDocumentType}/${idDocumentType}`);
  }

  deleteSelectedDocumentType(payload: number[]): Observable<DocumentType[]> {
    return this.webRequestService.deleteWithHeaders(this.pathDocumentType, undefined, payload);
  }

  // Servicios SCOPE (ALCANCE)
  getScopes(): Observable<Scope[]> {
    return this.webRequestService.getWithHeaders(this.pathScope);
  }

  getScope(idScope: number): Observable<Scope> {
    return this.webRequestService.getWithHeaders(`${this.pathScope}/${idScope}`);
  }

  createScope(scope: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathScope, scope);
  }

  updateScope(id: number, scope: Scope): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathScope}/${id}`, scope);
  }

  deleteScope(idScope: number): Observable<Scope> {
    return this.webRequestService.deleteWithHeaders(`${this.pathScope}/${idScope}`);
  }

  deleteSelectedScope(payload: number[]): Observable<Scope[]> {
    return this.webRequestService.deleteWithHeaders(this.pathScope, undefined, payload);
  }

  // Servicios Category
  getCategories(): Observable<Category[]> {
    return this.webRequestService.getWithHeaders(this.pathCategory);
  }

  getCategory(idCategory: number): Observable<Category> {
    return this.webRequestService.getWithHeaders(`${this.pathPeriodicity}/${idCategory}`);
  }

  createCategory(category: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathCategory, category);
  }

  updateCategory(id: number, category: Category): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathCategory}/${id}`, category);
  }

  deleteCategory(idCategory: number): Observable<Category> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCategory}/${idCategory}`);
  }

  deleteSelectedCategory(payload: number[]): Observable<Category[]> {
    return this.webRequestService.deleteWithHeaders(this.pathCategory, undefined, payload);
  }

  // Servicios Periodicity
  getPeriodicities(): Observable<Periodicity[]> {
    return this.webRequestService.getWithHeaders(this.pathPeriodicity);
  }

  getPeriodicity(idPeriodicity: number): Observable<Periodicity> {
    return this.webRequestService.getWithHeaders(`${this.pathPeriodicity}/${idPeriodicity}`);
  }

  createPeriodicity(periodicity: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathPeriodicity, periodicity);
  }

  updatePeriodicity(id: number, periodicity: Periodicity): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathPeriodicity}/${id}`, periodicity);
  }

  deletePeriodicity(idPeriodicity: number): Observable<Periodicity> {
    return this.webRequestService.deleteWithHeaders(`${this.pathPeriodicity}/${idPeriodicity}`);
  }

  deleteSelectedPeriodicity(payload: number[]): Observable<Periodicity[]> {
    return this.webRequestService.deleteWithHeaders(this.pathPeriodicity, undefined, payload);
  }

  // Servicios NormativityTypes
  getNormativityTypes(): Observable<NormativityType[]> {
    return this.webRequestService.getWithHeaders(this.pathNormativityType);
  }

  getNormativityType(idNormativityType: number): Observable<NormativityType> {
    return this.webRequestService.getWithHeaders(`${this.pathNormativityType}/${idNormativityType}`);
  }

  createNormativityType(normativityType: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathNormativityType, normativityType);
  }

  updateNormativityType(id: number, normativityType: NormativityType): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathNormativityType}/${id}`, normativityType);
  }

  deleteNormativityType(idNormativityType: number): Observable<NormativityType> {
    return this.webRequestService.deleteWithHeaders(`${this.pathNormativityType}/${idNormativityType}`);
  }

  deleteSelectedNormativityType(payload: number[]): Observable<NormativityType[]> {
    return this.webRequestService.deleteWithHeaders(this.pathNormativityType, undefined, payload);
  }
}
