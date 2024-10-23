import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class OkInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {}

  /**
   * Este método intersepta las peticiones HTTP que son enviados desde el backend.
   * Se manejar los eventos que de hayan generado luego de realizada una peticion, y este llegue como respuesta del servicio llamado.
   * Se hace uso del operador `tap`, para capturar el evento.
   * Se validada la respuesta del servicio, para disparar un toast que mostrara la respuesta de la solucitud que se haya realizado.
   * @param request contiene la solucitud HTTP que se esta interceptando.
   * @param next contiene el handler que manejará la petición.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            if (request.method === 'POST' && event.status === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Registro creado',
                detail: 'El registro se ha creado con éxito.',
              });
            } else if (request.method === 'PUT' && event.status === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Registro actualizado',
                detail: 'El registro se ha actualizado con éxito.',
              });
            } else if (request.method === 'DELETE' && event.status === 204) {
              this.messageService.add({
                severity: 'success',
                summary: 'Registro eliminado',
                detail: 'El registro se ha eliminado con éxito.',
              });
            }else if (request.method === 'DELETE' && event.status === 206) {
              this.messageService.add({
                severity: 'info',
                summary: 'Registros eliminados parcialmente',
                detail: 'Algunos registros no han podido ser eliminados',
              });
            }
          }
        })
      )
  }

}
