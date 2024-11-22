import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Rule } from '@models';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private pathRule: string = 'rule'

  constructor(
    private webRequestService: WebRequestService
  ) { }

  getRule(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathRule}/${id}`);
  }

  getRules(): Observable<Rule[]>{
    return this.webRequestService.getWithHeaders(`${this.pathRule}`);
  }

  /**
   * Obtiene la lista de reglas que están activas y son globales, pero también obtiene las reglas activas que no se configurado como
   * globales y que se han asociado al nivel y que están activas. Nota: Tambien se traen las reglas que se han definido como no globales 
   * y que no se han relacionado a ningún nivel.
   * @returns Rule[]
   */
  getGlobalAndLevelActiveRules(levelId: number): Observable<Rule[]>{
    return this.webRequestService.getWithHeaders(`${this.pathRule}/active`, {levelId: levelId});
  }

  createRule(rule: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathRule, rule);
  }

  updateRule(id: number, rule: Rule): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathRule}/${id}`, rule);
  }

  deleteRule(idRule: number): Observable<Rule> {
    return this.webRequestService.deleteWithHeaders(`${this.pathRule}/${idRule}`);
  }

  deleteSelectedRules(payload: number[]): Observable<Rule[]> {
    return this.webRequestService.deleteWithHeaders(this.pathRule, undefined, payload);
  }

}