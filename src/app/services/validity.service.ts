import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ValidityService {
  private pathValidity: string = 'validity'

  constructor(
    private webRequestService: WebRequestService
  ) { }

  getpathValidities() {
    return this.webRequestService.getWithHeaders(this.pathValidity);
  }
}
