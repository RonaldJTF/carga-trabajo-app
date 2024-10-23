import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { map, Observable, of } from 'rxjs';
import { Structure } from '@models';
import {HttpEventType, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StructureService {

  private pathStructure: string = 'structure'

  constructor(
    private webRequestService: WebRequestService
  ) { }


  getStructureById(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathStructure}/${id}`);
  }

  getDependencyInformationById(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathStructure}/dependency/${id}`);
  }

  getStructures(): Observable<Structure[]>{
    return this.webRequestService.getWithHeaders(this.pathStructure);
  }

  getDependencies(): Observable<Structure[]>{
    return this.webRequestService.getWithHeaders(`${this.pathStructure}/dependencies`);
  }

  createStructure (payload: any) : Observable<HttpResponse<any>> {
    return this.webRequestService.postWithHeaders(this.pathStructure, payload)
  }

  updateStructure (id: number, payload: any) : Observable<HttpResponse<any>> {
    return this.webRequestService.putWithHeaders(`${this.pathStructure}/${id}`, payload);
  }

  deleteSelectedStrustures(payload: number[]):  Observable<Structure[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathStructure}`, undefined, payload);
  }

  deleteStructure (id: number) : Observable<HttpResponse<any>> {
    return this.webRequestService.deleteWithHeaders(`${this.pathStructure}/${id}`)
  }

  downloadReport(type: string, structureIds: number[]): Observable<number>{
    const options = {
      //responseType: 'blob' as 'json',
      //observe: 'response' as 'body'
      responseType: 'blob',
      observe: 'events',
      reportProgress: true
    };
    return this.webRequestService.getWithHeaders(`${this.pathStructure}/report`, {type: type, structureIds: JSON.stringify(structureIds ?? [])}, null, options).pipe(
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
        //this.handleFileDownload(e);
        //return e;
      })
    )
  }

  getActivityById(id: number){
    return this.webRequestService.getWithHeaders(`${this.pathStructure}/activity/${id}`);
  }

  createActivity(payload: any){
    return this.webRequestService.postWithHeaders(`${this.pathStructure}/activity`, payload)
  }

  updateActivity (id: number, payload: any) : Observable<HttpResponse<any>> {
    return this.webRequestService.putWithHeaders(`${this.pathStructure}/activity/${id}`, payload);
  }

  deleteActivity(id: number) : Observable<HttpResponse<any>> {
    return this.webRequestService.deleteWithHeaders(`${this.pathStructure}/activity/${id}`)
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
