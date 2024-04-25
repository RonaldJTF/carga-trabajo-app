import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class MatrizlevantamientoService {
  private pathExcel = 'excel';

  constructor(private webRequestService: WebRequestService) {}

  gertExcel() {
    return this.webRequestService.get(this.pathExcel);
  }
}
