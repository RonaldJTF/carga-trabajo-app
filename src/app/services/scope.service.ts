import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WebRequestService} from './web-request.service';
import { Scope } from '@models';

@Injectable({
  providedIn: 'root',
})
export class ScopeService {
  private pathAlcance = 'scope';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getScope(): Observable<Scope[]> {
    return this.webRequestService.getWithHeaders(this.pathAlcance);
  }
}
