import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class MatrizlevantamientoService {
  private pathExcel = 'excel';

  constructor(private webRequestService: WebRequestService) {}

  geExcel() {
    return this.webRequestService.get(this.pathExcel);
  }
}
