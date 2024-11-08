import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Variable} from '@models';
import {WebRequestService} from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class PrimaryVariableService {
  private pathVariablePrimaria = 'primary-variable';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getPrimaryVariable(): Observable<Variable[]> {
    return this.webRequestService.getWithHeaders(this.pathVariablePrimaria);
  }
}