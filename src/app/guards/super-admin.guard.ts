import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@services';

/**
 * Esta función se utiliza como guardia de ruta y permitir el acceso solo a los usuarios que tienen el rol super administrador.
 * La función utiliza la función `inject` para obtener instancias de `Router` y `AuthenticationService`.
 * Luego, obtiene los roles del usuario actual a través del método `roles()` del servicio de autenticación.
 * Si el usuario actual tiene el rol super administrador, la función devuelve `true`, lo que permite el acceso a la ruta protegida.
 * Si el usuario no tiene el rol de super administrador, la función redirige al usuario a la página de `not-found`.
 * @param route contiene información sobre la ruta actual, como la URL, los parámetros de la ruta y los datos de navegacion.
 * @param state contiene la URL actual y el historial de navegación.
 */
export const superAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const {isAdministrator, isOperator, isSuperAdministrator} = authenticationService.roles();

  if (isSuperAdministrator) {
    return true;
  }
  router.navigate(["/not-found"], {
      queryParams: { returnUrl: state.url },
  });
  return false;
};
