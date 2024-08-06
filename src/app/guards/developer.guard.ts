import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/auth.service";

export const developerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const {isDesarrollador} = authenticationService.roles();
  if (isDesarrollador) {
    return true;
  }
  router.navigate(["/not-found"], {
    queryParams: {returnUrl: state.url},
  });
  return false;
};
