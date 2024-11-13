import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WebRequestService} from './web-request.service';
import { Periodicity } from '@models';

@Injectable({
  providedIn: 'root',
})
export class PeriodicityService {
  private pathPeriodicidad = 'periodicity';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getPeriodicities(): Observable<Periodicity[]> {
    return this.webRequestService.getWithHeaders(this.pathPeriodicidad);
  }
}
