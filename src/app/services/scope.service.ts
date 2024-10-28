import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Scope } from '@models';

@Injectable({
  providedIn: 'root'
})
export class ScopeService {
  private pathScope: string = 'scope'

  constructor(
    private webRequestService: WebRequestService
  ) { }

  getScopes(): Observable<Scope[]>{
    return this.webRequestService.getWithHeaders(this.pathScope);
  }
}
