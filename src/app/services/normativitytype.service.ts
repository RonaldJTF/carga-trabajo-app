import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NormativityType} from '@models';
import {WebRequestService} from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class NormativityTypeService {
  private pathTipoNormatividad = 'normativity-type';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getNormativityType(): Observable<NormativityType[]> {
    return this.webRequestService.getWithHeaders(this.pathTipoNormatividad);
  }
}
