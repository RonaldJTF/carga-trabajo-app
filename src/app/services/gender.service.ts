import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Gender } from '@models';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private pathGender = 'gender';

  constructor(
    private webRequestService: WebRequestService
  ) {}

  getGenders(): Observable<Gender[]> {
    return this.webRequestService.getWithHeaders(this.pathGender);
  }
}
