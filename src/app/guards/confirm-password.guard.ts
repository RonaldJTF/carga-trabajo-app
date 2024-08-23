import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ChangePasswordService, CryptojsService} from "@services";

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
