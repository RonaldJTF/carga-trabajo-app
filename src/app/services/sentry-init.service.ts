import {Injectable} from '@angular/core';
import * as Sentry from "@sentry/angular";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./auth.service";
import {DialogService} from "primeng/dynamicdialog";
import {DialogComponent} from "@shared";

@Injectable({
  providedIn: 'root'
})
export class SentryInitService {

  constructor(
    private authService: AuthenticationService,
    private dialogService: DialogService,
  ) {
  }

  initSentry() {
    Sentry.init({
      dsn: "https://ba07f36089ad6643345fb51fb4c94204@o4507810407383040.ingest.us.sentry.io/4507810414395392", // Donde se eviarán los eventos. DSN(Nombre de la Fuente de Datos).
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.browserProfilingIntegration(),
        Sentry.replayIntegration()
      ],

      // Performance Monitoring
      tracesSampleRate: 1.0, // Captura 100% de las transacciones.
      tracePropagationTargets: [environment.URLPAGE, environment.API_REG_EXP], // URLs habilitadas para hacer seguimiento(URl donde se encuentra la aplicacion y URL de las APIs).

      // Repeticiones de sesión - esto es una grabación parecido a un video, para capturar lo que el usuario hizo antes durantes y despues de ocurrido el evento.
      replaysSessionSampleRate: 0.1, // Esto establece la frecuencia de muestreo en 10%.
      replaysOnErrorSampleRate: 1.0, // Cambia la freceuncia de muestreo al 100% cuando ocurra un error en la sesión.
      profilesSampleRate: 1.0,

      // Definir variables a enviar a la plataforma
      initialScope: {},
      release: "1.0.01.00", // Versión del aplicativo.
      environment: environment.environment, // Define el ambiente desde donde se lanza el evento.

      // Metodo para trabajar con la data antes de ser enviada a sentry.
      beforeSend: (event) => {
        if (event.level === 'error') {
          if (this.authService.getLoggedPersonInformation()) {
            event.user = {
              idPerson: this.authService.getLoggedPersonInformation().id,
              name: this.authService.getLoggedPersonInformation().primerNombre + " " + this.authService.getLoggedPersonInformation().primerApellido,
              email: this.authService.getLoggedPersonInformation().correo,
              phone: this.authService.getLoggedPersonInformation().telefono,
              username: this.authService.getLoggedPersonInformation().usuario.username
            }
          }
          this.openModal();
        }
        return event;
      }
    });
  }

  openModal() {
    this.dialogService.open(DialogComponent, {
      width: '600px',
      draggable: true,
      showHeader: false,
      header: '!Ups algo salió mal!'
    });
  }
}
