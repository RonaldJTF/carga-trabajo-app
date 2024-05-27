import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private pathMedia: string = 'media';

  constructor(
    private webRequestService: WebRequestService,
    private http: HttpClient,
  ) {}

  download(idArchivo: number){
    const options = {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    };
    this.webRequestService.getWithHeaders(`${this.pathMedia}/download/${idArchivo}`, null, null, options)
    .subscribe(response => {
      this.handleFileDownload(response);
    });;
  }

  downloadByPath(path: string){
    const options = {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    };
    this.webRequestService.getWithHeaders(`${this.pathMedia}/download${path.startsWith('/') ? path : '/' + path}`, null, null, options)
    .subscribe(response => {
      this.handleFileDownload(response);
    });;
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
