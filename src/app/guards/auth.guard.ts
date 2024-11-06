import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@services';
import { inject } from '@angular/core';

/**
 * Este guardián verifica si el usuario tiene un rol válido antes de permitir el acceso a una ruta protegida.
 * Si el usuario no está autenticado o no tiene un rol, es redirigido a la página de inicio de sesión y se cierra su sesión actual.
 * @param route contiene información sobre la ruta actual, como la URL, los parámetros de la ruta y los datos de navegacion.
 * @param state contiene la URL actual y el historial de navegación.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const role = authenticationService.getRoleUser();

  if (role) {
    return true;
  }
  router.navigate(["/account/auth/login"], {
      queryParams: { returnUrl: state.url },
  });

  authenticationService.logout();
  return false;
};
