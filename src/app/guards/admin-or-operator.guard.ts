import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/auth.service";

export const adminOrOperatorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const {isAdministrator, isOperator, isSuperAdministrator, isDesarrollador} = authenticationService.roles();

  const isAdminOrOperator = isAdministrator || isOperator || isSuperAdministrator;

  if (isAdminOrOperator) {
    return true;
  } else {
    isDesarrollador && router.navigate(["/developer/basic-tables"], {
      queryParams: {returnUrl: state.url},
    });
    return false;
  }

};
