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