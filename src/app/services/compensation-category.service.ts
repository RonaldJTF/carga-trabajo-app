import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WebRequestService} from './web-request.service';
import { Category } from '@models';


@Injectable({
  providedIn: 'root',
})
export class CompensationCategoryService {
  private pathCategory = 'compensation-category';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getCategories(): Observable<Category[]> {
    return this.webRequestService.getWithHeaders(this.pathCategory);
  }

  getCategory(idCategory: number): Observable<any> {
    return this.webRequestService.getWithHeaders(`${this.pathCategory}/${idCategory}`);
  }

  createCategory(category: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathCategory, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathCategory}/${id}`, category);
  }

  deleteCategory(idCategory: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathCategory}/${idCategory}`);
  }
  
  getScope(): Observable<Category[]> {
    return this.webRequestService.getWithHeaders(this.pathCategory);
  }
}
