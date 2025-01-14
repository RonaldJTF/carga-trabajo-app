import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Convention} from '@models';
import {WebRequestService} from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class ConventionService {
  private pathConvencion = 'convention';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getConvention(): Observable<Convention[]> {
    return this.webRequestService.getWithHeaders(this.pathConvencion);
  }
}