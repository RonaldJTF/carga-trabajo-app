import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable, catchError, throwError} from 'rxjs';
import {AuthenticationService} from '@services';
import {MessageService} from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {
  }

  /**
   * Este método intersepta las peticiones HTTP que son enviados desde el backend.
   * Se manejar los error que de hayan generado luego de realizada una peticion y este llegue como respuesta del servicio llamado.
   * Se hace uso del operador `catchError`, para capturar el error.
   * El error el validado para disparar un toast donde el usuario podra evidenciar el error que se ha generado.
   * @param request contiene la solucitud HTTP que se esta interceptando.
   * @param next contiene el handler que manejará la petición.
   */
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
            console.log(error)
            errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
            if (error.status === 401) {
              this.authenticationService.logout();
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'Acceso denegado', life: 3000,});
            }
            if (error.status === 403) {
              this.messageService.add({
                severity: 'error',
                summary: 'Acceso Denegado',
                detail: 'Parece que has intentado realizar una acción no permitida en esta aplicación. Si crees que esto es un error, por favor, contacta al administrador',
                life: 3000,
              });
            }
            if (error.status === 500) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `${error.error.message}`,
                life: 3000,
              });
            }
            if (error.status === 404) {
              this.messageService.add({severity: 'error', summary: 'No encontrado', life: 3000,});
            }
          }
          return throwError(errorMsg);
        })
      )
  }

}
