import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ChangePasswordService} from "../pages/configurations/users/change-password/service/change-password.service";
import {CryptojsService} from "../services/cryptojs.service";

export const confirmPasswordGuard: CanActivateFn = () => {
  const router = inject(Router);
  const changePasswordService = inject(ChangePasswordService);
  const cryptoService = inject(CryptojsService);
  let usuario = null;
  let persona = null;

  changePasswordService.getUser().subscribe(user => {
    usuario = user;
  })
  changePasswordService.getPerson().subscribe(person => {
    persona = person;
  })

  if (usuario) {
    return true;
  } else {
    router.navigate(['configurations/users/change-password/', cryptoService.encryptParam(persona.id)], {
      skipLocationChange: true,
    }).then();
    return false;
  }
};
