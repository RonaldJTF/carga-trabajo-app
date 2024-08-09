import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@services';
import { inject } from '@angular/core';

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
