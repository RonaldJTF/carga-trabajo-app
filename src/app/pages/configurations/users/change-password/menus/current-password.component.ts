import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, Subscription} from "rxjs";
import {User} from "@models";
import {ChangePasswordService, ToastService, UserService} from "@services";

@Component({
  template: `
    <div class="flex flex-column align-items-center justify-content-center py-5 px-3">
      <div class="flex flex-column align-items-center text-center p-3">
        <div class="w-5rem h-5rem flex align-items-center justify-content-center bg-blue-100 border-circle">
          <i class="pi pi-key text-4xl text-blue-500"></i>
        </div>
        <span class="font-bold">Ingresa tu contraseña actual.</span>
        <span class="text-500">Debes  confirmar con tu contraseña actual para proceder con el cambio</span>
      </div>
    </div>
    <form [formGroup]="formConfirmPasswordUser" (keydown)="keyboardEvent($event)" autocomplete="off"
          autocapitalize="none">
      <div class="grid">
        <div class="field col">
          <label for="password" class="font-medium">Contraseña actual</label>
          <p-password id="password" [feedback]="false" placeholder="Contraseña" [toggleMask]="true"
                      styleClass="mb-2 w-full" inputStyleClass="w-full p-3" formControlName="password"
                      aria-autocomplete="none">
          </p-password>
          <div *ngIf="passwordNoValido">
            <div *ngIf="controls['password'].errors?.['required']">
              <small class="p-error">Ingrese un contraseña</small>
            </div>
          </div>
        </div>
      </div>
      <div class=" flex flex-wrap justify-content-end m-0 p-0">
        <button pButton pRipple icon="pi pi-times" class="p-button-secondary ml-2" (click)="onCancelChangePassword($event)"
                [disabled]="creatingOrUpdating">
          <span class="hidden-xs p-button-label pl-2">Cancelar</span>
        </button>
        <button pButton pRipple [icon]="creatingOrUpdating ? 'pi pi-spin pi-spinner m-0' : 'pi pi-send'"
                class="p-button-success ml-2"
                type="submit" (click)="nextPage()"
                [disabled]="formConfirmPasswordUser.invalid || creatingOrUpdating">
          <span class="hidden-xs p-button-label pl-2">Siguiente</span>
        </button>
      </div>
    </form>
  `
})

export class CurrentPasswordComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  formConfirmPasswordUser: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private changePasswordService: ChangePasswordService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.buildFormConfirmPassword();
    this.getPerson();
  }

  getPerson() {
    this.subscription = this.changePasswordService.getPerson().subscribe(person => {
      if (person != null) {
        this.assignValuesToForm(person.usuario);
      }
    });
  }

  buildFormConfirmPassword() {
    this.formConfirmPasswordUser = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formConfirmPasswordUser.get(nombreAtributo)?.invalid &&
      (this.formConfirmPasswordUser.get(nombreAtributo)?.dirty ||
        this.formConfirmPasswordUser.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formConfirmPasswordUser.controls;
  }

  get passwordNoValido() {
    return this.isValido('password');
  }

  onCancelChangePassword(event: MouseEvent): void {
    event.preventDefault();
    this.formConfirmPasswordUser.reset();
    this.updateMode = false;
    this.router.navigate([this.changePasswordService.getPreviousUrl()], {
      skipLocationChange: true,
    }).then();
  }

  nextPage() {
    if (this.formConfirmPasswordUser.valid) {
      this.creatingOrUpdating = true;
      this.userService.validatePassword(this.formConfirmPasswordUser.value).pipe(
        finalize(() => {
          this.creatingOrUpdating = false;
        })
      ).subscribe({
        next: (result) => {
          if (result != null) {
            this.changePasswordService.setUser(result);
            this.router.navigate(['../new-password'], {
              relativeTo: this.route,
              skipLocationChange: true
            }).then();
            this.formConfirmPasswordUser.reset();
          } else {
            this.toastService.showError("Error", "La contraseña es incorrecta.");
          }
        }
      });
    }
  }

  assignValuesToForm(user: User) {
    this.formConfirmPasswordUser.get('username').setValue(user.username);
  }

  keyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.nextPage();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
