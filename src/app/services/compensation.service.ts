import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {Observable} from "rxjs";
import {CryptojsService} from "./cryptojs.service";

@Injectable({
  providedIn: 'root'
})
export class CompensationService {

  private pathCompensation = 'compensation';

  private pathCategory = this.pathCompensation.concat('/category');

  private pathLevelCompensation = this.pathCompensation.concat('/level');

  private pathRule = 'rule';

  private pathVariable = 'validity/variable'

  constructor(
    private webRequestService: WebRequestService,
    private cryptoService: CryptojsService
  ) {
  }

  /**
   * Services COMPENACIÓN LABORAL
   */
  getCompesations(): Observable<string[]> {
    return this.webRequestService.getWithHeaders(this.pathCompensation);
  }

  getCompensation(idCompensation: string): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathCompensation}/${idCompensation}`);
  }

  createCompensation(compensation: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathCompensation, compensation);
  }

  updateCompensation(id: string, compensation: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathCompensation}/${id}`, compensation);
  }

  deleteCompensation(idCompensation: string): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCompensation}/${idCompensation}`);
  }

  deleteSelectedCompensations(payload: string[]): Observable<string[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCompensation}`, undefined, payload);
  }

  /**
   * Servicios CATEGORIAS
   */
  getCategories(): Observable<string[]> {
    return this.webRequestService.getWithHeaders(this.pathCategory);
  }

  getCategory(idCategory: string): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathCategory}/${idCategory}`);
  }

  createCategory(category: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathCategory, category);
  }

  updateCategory(id: string, category: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathCategory}/${id}`, category);
  }

  deleteCategory(idCategory: string): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCategory}/${idCategory}`);
  }

  /**
   * Services COMPENACIÓN LABORAL NIVEL VIGENCIA
   */
  getLevelCompensations(idLevel: string): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathLevelCompensation}/${idLevel}`);
  }

  getLevelCompensation(idLevelCompensation: string): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathLevelCompensation}/${idLevelCompensation}`);
  }

  createLevelCompensation(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathLevelCompensation, payload);
  }

  updateLevelCompensation(id: string, payload: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathLevelCompensation}/${id}`, payload);
  }

  deleteLevelCompensation(idLevelCompensation: string): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathLevelCompensation}/${idLevelCompensation}`);
  }

  deleteSelectedLevelCompensations(payload: string[]): Observable<string[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathLevelCompensation}`, undefined, payload);
  }

  //
  getRules(){
    return this.webRequestService.getWithHeaders(this.pathRule);
  }

  getVariables(){
    return this.webRequestService.getWithHeaders(this.pathVariable);
  }


}
