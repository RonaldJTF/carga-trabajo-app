import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WebRequestService} from './web-request.service';
import { Category } from '@models';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private pathCategory = 'category';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getScope(): Observable<Category[]> {
    return this.webRequestService.getWithHeaders(this.pathCategory);
  }
}
