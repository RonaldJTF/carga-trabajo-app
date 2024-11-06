import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {ChangePasswordService, CryptojsService} from "@services";

/**
 * Este guardian verifica que el usuario haya sido confirmado antes de proceder con el cambio de contraseña.
 * Se utiliza la funcion `inject` para instanciar la clase `Router`, `ChangePasswordService` y `CryptojsService`.
 * Se obteine el usuario que fue confirmado en `ChangePasswordService`,
 * Luego, se verifica que el usuario no este null y se permitira el ingreso al segundo paso del cambio de contraseña.
 * Si el usuario es null, sera redireccionado a la pagina de confirmación de contraseña enviando como parametro el id de la persona logeada.
 */
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
