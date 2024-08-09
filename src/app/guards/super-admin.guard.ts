import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@services';

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
