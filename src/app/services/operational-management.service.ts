import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { OperationalManagement } from '@models';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperationalManagementService {
  private pathOperationalManagement: string = 'operational-management';

  constructor(
    private webRequestService: WebRequestService
  ) { }


  getOperationalManagementById(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathOperationalManagement}/${id}`);
  }

  getOperationalsManagements(): Observable<OperationalManagement[]>{
    return this.webRequestService.getWithHeaders(this.pathOperationalManagement);
  }

  createOperationalManagement (payload: any) : Observable<HttpResponse<any>> {
    return this.webRequestService.postWithHeaders(this.pathOperationalManagement, payload)
  }

  updateOperationalManagement (id: number, payload: any) : Observable<HttpResponse<any>> {
    return this.webRequestService.putWithHeaders(`${this.pathOperationalManagement}/${id}`, payload);
  }

  deleteSelectedOperationalsManagements(payload: number[]):  Observable<OperationalManagement[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOperationalManagement}`, undefined, payload);
  }

  deleteOperationalManagement (id: number) : Observable<HttpResponse<any>> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOperationalManagement}/${id}`)
  }
}
