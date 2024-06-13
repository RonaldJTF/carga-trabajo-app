import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const {isAdministrator, isOperator} = authenticationService.roles();

  if (isAdministrator) {
    return true;
  }
  router.navigate(["/not-found"], {
      queryParams: { returnUrl: state.url },
  });
  return false;
};
