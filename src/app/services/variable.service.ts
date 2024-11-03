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
}