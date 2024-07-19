import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";
import {finalize, Subscription} from "rxjs";
import {User} from "../../../../../models/user";
import {ChangePasswordService} from "../service/change-password.service";
import {CryptojsService} from "../../../../../services/cryptojs.service";
import {AuthenticationService} from "../../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  template: `
    <div class="flex flex-column align-items-center justify-content-center h-full py-5 px-3">
      <div class="flex flex-column align-items-center text-center p-3">
        <ng-container *ngIf="!okSent else sNoIcon">
          <div class="w-5rem h-5rem flex align-items-center justify-content-center bg-blue-100 border-circle">
            <i class="pi pi-lock text-4xl text-blue-500"></i>
          </div>
          <span class="font-bold">Ingresa tu nueva contraseña.</span>
          <span class="text-500">Elige una nueva contraseña para tu cuenta y asegúrate de que sea única y segura.</span>
        </ng-container>
        <ng-template #sNoIcon>
          <div class="w-5rem h-5rem flex align-items-center justify-content-center bg-green-100 border-circle">
            <app-countdown-timer [colorName]="'green'"></app-countdown-timer>
          </div>
          <span class="font-bold">Iniciar sesión.</span>
          <span class="text-500">Serás redirigido al formulario de inicio de sesión para el ingreso al aplicativo nuevamente.</span>
        </ng-template>
      </div>
    </div>
    <form *ngIf="!okSent" [formGroup]="formNewPasswordUser" (keydown)="keyboardEvent($event)" autocomplete="off" autocapitalize="none">
      <div class="grid">
        <div class="field col">
          <label for="newPassword" class="font-medium">Nueva contraseña</label>
          <p-password id="newPassword" [feedback]="true" placeholder="Contraseña" [toggleMask]="true"
                      styleClass="mb-2 w-full" inputStyleClass="w-full p-3"
                      formControlName="newPassword" weakLabel="Débil" mediumLabel="Moderada"
                      strongLabel="Fuerte" promptLabel="Ingresa una contraseña"></p-password>
          <div *ngIf="newPasswordNoValido">
            <div *ngIf="controls['newPassword'].errors?.['required']">
              <small class="p-error">Ingrese un contraseña</small>
            </div>
          </div>

          <label for="confirmPassword" class="font-medium">Confirmar nueva contraseña</label>
          <p-password id="confirmPassword" [feedback]="true" placeholder="Contraseña" [toggleMask]="true"
                      styleClass="mb-2 w-full" inputStyleClass="w-full p-3"
                      formControlName="confirmPassword" weakLabel="Débil" mediumLabel="Moderada"
                      strongLabel="Fuerte" promptLabel="Ingresa una contraseña"></p-password>
          <div *ngIf="confirmPasswordNoValido">
            <div *ngIf="controls['confirmPassword'].errors?.['required']">
              <small class="p-error">Ingrese un contraseña</small>
            </div>
          </div>
          <div *ngIf="passwordsMismatch">
            <small class="p-error">Las contraseñas no coinciden.</small>
          </div>
        </div>
      </div>
      <div class=" flex flex-wrap justify-content-end m-0 p-0">
        <button pButton pRipple icon="pi pi-undo" class="p-button-secondary ml-2" (click)="onCancelChangePassword()"
                [disabled]="creatingOrUpdating">
          <span class="hidden-xs p-button-label pl-2">Anterior</span>
        </button>
        <button pButton pRipple [icon]="creatingOrUpdating ? 'pi pi-spin pi-spinner m-0' : 'pi pi-send'"
                class="p-button-success ml-2"
                type="submit" (click)="savePassword()"
                [disabled]="formNewPasswordUser.invalid || creatingOrUpdating">
          <span class="hidden-xs p-button-label pl-2">Actualizar</span>
        </button>
      </div>
    </form>
  `
})

export class NewPasswordComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  updateUser: User = new User();

  formNewPasswordUser: FormGroup;

  updateMode: boolean = true;

  creatingOrUpdating: boolean = false;

  okSent: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private changePasswordService: ChangePasswordService,
    private cryptoService: CryptojsService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.buildFormConfirmarPassword();
  }

  buildFormConfirmarPassword() {
    this.formNewPasswordUser = this.formBuilder.group({
      newPassword: ["", Validators.required],
      confirmPassword: ["", Validators.required],
    }, {validators: this.passwordsMatchValidator()})
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formNewPasswordUser.get(nombreAtributo)?.invalid &&
      (this.formNewPasswordUser.get(nombreAtributo)?.dirty ||
        this.formNewPasswordUser.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formNewPasswordUser.controls;
  }

  get newPasswordNoValido() {
    return this.isValido('newPassword');
  }

  get confirmPasswordNoValido() {
    return this.isValido('confirmPassword');
  }

  get passwordsMismatch() {
    return this.formNewPasswordUser.hasError('passwordsMismatch') &&
      this.formNewPasswordUser.get('confirmPassword')?.touched;
  }

  getPerson() {
    this.subscription = this.changePasswordService.getPerson().subscribe(person => {
      if (person != null) {
        this.buildPayload(this.formNewPasswordUser.value, person.usuario);
      }
    });
  }

  savePassword() {
    if (this.formNewPasswordUser.valid) {
      this.getPerson();
    }
  }

  buildPayload(payload: any, user: User) {
    this.updateUser.id = user?.id;
    this.updateUser.username = user.username;
    this.updateUser.password = this.cryptoService.encrypt(payload.newPassword);
    this.updateUser.activo = user.activo;
    if (this.updateUser) {
      this.sendPassword(this.updateUser);
    }
  }

  sendPassword(user: User): void {
    if (this.formNewPasswordUser.valid && user) {
      this.creatingOrUpdating = true;
      this.userService.updatePassword(user).pipe(
        finalize(() => {
          this.creatingOrUpdating = false;
        })
      ).subscribe({
        next: (result) => {
          if (result) {
            this.changePasswordService.clear();
            this.okSent = true;
            this.formNewPasswordUser.reset();
            setTimeout(() => {
              this.authenticationService.logout();
              this.updateUser = null;
            }, 6000);
          }
        }
      });
    }
  }

  onCancelChangePassword(): void {
    this.formNewPasswordUser.reset();
    this.subscription = this.changePasswordService.getPerson().subscribe(person => {
      if (person != null) {
        this.changePasswordService.setUser(null);
        this.router.navigate(['configurations/users/change-password/'], {
          skipLocationChange: true,
        }).then();
      }
    })
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('newPassword');
      const confirmPassword = control.get('confirmPassword');
      if (!password || !confirmPassword) {
        return null;
      }
      return password.value === confirmPassword.value ? null : {passwordsMismatch: true};
    };
  }

  keyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
