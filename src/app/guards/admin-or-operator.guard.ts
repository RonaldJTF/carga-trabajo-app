import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "@services";

/**
 * Esta función se utiliza como guardia de ruta y permitir el acceso solo a los usuarios que tienen los roles administrador, operador o seper administrador.
 * La función utiliza la función `inject` para obtener instancias de `Router` y `AuthenticationService`.
 * Luego, obtiene los roles del usuario actual a través del método `roles()` del servicio de autenticación.
 * Si el usuario actual tiene el rol de administrador o es operador o super adminstrador, la función devuelve `true`, lo que permite el acceso a la ruta protegida.
 * Luego, se valida si el usuario tiene el rol desarrollador, si es asi sera redireccionado a la pagina de tablas basicas.
 * Si ningunas de las validaciones antes mencionadas se cumple el metodo retornara false.
 * @param route contiene información sobre la ruta actual, como la URL, los parámetros de la ruta y los datos de navegacion.
 * @param state contiene la URL actual y el historial de navegación.
 */
export const adminOrOperatorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const {isAdministrator, isOperator, isSuperAdministrator, isDeveloper} = authenticationService.roles();

  const isAdminOrOperator = isAdministrator || isOperator || isSuperAdministrator;

  if (isAdminOrOperator) {
    return true;
  } else {
    isDeveloper && router.navigate(["/developer/basic-tables"], {queryParams: {returnUrl: state.url}});
    return false;
  }

};
