import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Gender } from '../models/gender';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private pathGender = 'gender';

  constructor(
    private webRequestService: WebRequestService
  ) {}

  getDocumentType(): Observable<Gender[]> {
    return this.webRequestService.getWithHeaders(this.pathGender);
  }
}
