import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService, LayoutService, ToastService} from "@services";

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  formRecoverPassword: FormGroup;

  loader: boolean = false;

  okRecoverPassword: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.formRecoverPassword = this.formBuilder.group({
      correo: ["", Validators.compose([Validators.email, Validators.required, Validators.maxLength(120)])]
    })
  }


  private isValido(nombreAtributo: string) {
    return (
      this.formRecoverPassword.get(nombreAtributo)?.invalid &&
      (this.formRecoverPassword.get(nombreAtributo)?.dirty ||
        this.formRecoverPassword.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formRecoverPassword.controls;
  }

  get correoNoValido() {
    return this.isValido('correo');
  }

  onSubmit() {
    if (this.formRecoverPassword.invalid) {
      this.formRecoverPassword.markAllAsTouched();
      return;
    } else {
      this.loader = true;
      this.authenticationService.recoverPassword(this.formRecoverPassword.value).subscribe({
        next: (r) => {
          let detail = 'Ver más detalles en el correo enviado.';
          this.toastService.showInfo(r.message, detail);
          setTimeout(() => {
            this.loader = false;
            this.okRecoverPassword = true;
          }, 1000)
        },
        error: () => {
          this.loader = false;
        }
      })
    }
  }

  login() {
    this.router.navigate(['account/auth/login']).then();
  }
}
