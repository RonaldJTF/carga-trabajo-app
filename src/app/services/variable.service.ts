import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Variable } from '@models';

@Injectable({
  providedIn: 'root'
})
export class VariableService {
  private pathVariable: string = 'variable'

  constructor(
    private webRequestService: WebRequestService
  ) { }

  getVariable(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathVariable}/${id}`);
  }

  getVariables(): Observable<Variable[]>{
    return this.webRequestService.getWithHeaders(`${this.pathVariable}`);
  }

  /**
   * Obtiene la lista de variables que están activas, son globales y no son primarias, pero también obtiene las variables activas que no se configurado como
   * globales y que se han asociado al nivel y que están activas. Nota: Tambien se traen las variables que se han definido como no globales 
   * y que no se han relacionado a ningún nivel en compensacionLabNivelVigencia.
   * @returns Rule[]
   */
  getGlobalAndLevelActiveVariables(levelId: number): Observable<Variable[]>{
    return this.webRequestService.getWithHeaders(`${this.pathVariable}/active`, {levelId: levelId});
  }

  /**
   * Obtiene todas las variables que dependen de una vigencia, por ejemplo el salario mínimo, y que estan activas
   * @returns Variable[]
   */
  getVariablesConfigureByValidityAndActive(): Observable<Variable[]>{
    return this.webRequestService.getWithHeaders(`${this.pathVariable}/configured-by-validity`);
  }

  createVariable(variable: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathVariable, variable);
  }

  updateVariable(id: number, variable: Variable): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathVariable}/${id}`, variable);
  }

  deleteVariable(idVariable: number): Observable<Variable> {
    return this.webRequestService.deleteWithHeaders(`${this.pathVariable}/${idVariable}`);
  }

  deleteSelectedVariables(payload: number[]): Observable<Variable[]> {
    return this.webRequestService.deleteWithHeaders(this.pathVariable, undefined, payload);
  }

}