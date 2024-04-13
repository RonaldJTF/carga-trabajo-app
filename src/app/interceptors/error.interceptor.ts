import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          if (error.error instanceof ErrorEvent) {
            console.log('This is client side error');
            errorMsg = `Error: ${error.error.message}`;
          } else {
            console.log('This is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            if (error.status === 401) {
              this.authenticationService.logout();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Acceso denegado', life: 3000, });
            }
            if (error.status === 500) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: `${error.error.message}`, life: 3000, });
            }
            if (error.status === 404) {
              this.messageService.add({ severity: 'error', summary: 'No encontrado', life: 3000, });
            }
          }
          console.log(errorMsg);
          return throwError(errorMsg);
        })
      )
  }

}
