import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { map, Observable } from 'rxjs';
import { OperationalManagement } from '@models';
import { HttpEventType, HttpResponse } from '@angular/common/http';

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
    return this.webRequestService.postWithHeaders(this.pathOperationalManagement, payload);
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

  migrateStructures (idParent: number, payload: any) : Observable<HttpResponse<any[]>> {
    return this.webRequestService.postWithHeaders(`${this.pathOperationalManagement}/migrate-structures`, payload, {idParent: idParent});
  }

  getActivityById(id: number){
    return this.webRequestService.getWithHeaders(`${this.pathOperationalManagement}/activity/${id}`);
  }

  createActivity(payload: any){
    return this.webRequestService.postWithHeaders(`${this.pathOperationalManagement}/activity`, payload)
  }

  updateActivity (id: number, payload: any) : Observable<HttpResponse<any>> {
    return this.webRequestService.putWithHeaders(`${this.pathOperationalManagement}/activity/${id}`, payload);
  }

  deleteActivity(id: number) : Observable<HttpResponse<any>> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOperationalManagement}/activity/${id}`)
  }

  downloadReport(type: string, operationalManagementIds: number[]): Observable<number>{
    const options = {
      responseType: 'blob',
      observe: 'events',
      reportProgress: true
    };
    return this.webRequestService.getWithHeaders(`${this.pathOperationalManagement}/report`, {type: type, operationalManagementIds: JSON.stringify(operationalManagementIds ?? [])}, null, options).pipe(
      map(e => {
        switch (e.type) {
          case HttpEventType.DownloadProgress:
            return Math.round((100 * e.loaded) / (e.total || 1));
          case HttpEventType.Response:
            this.handleFileDownload(e);
            return 100;
          default:
            return 0;
        }
      })
    )
  }

  private handleFileDownload(response: HttpResponse<Blob>) {
    const filename = this.getFilenameFromHttpResponse(response);
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getFilenameFromHttpResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition');
    const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
    return matches != null ? matches[1] : 'archivo_descargado';
  }
}
