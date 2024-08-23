import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, CryptojsService, LayoutService, ToastService} from "@services";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  formChangePassword: FormGroup;

  tokenPassword: number;

  loader = false;

  okChangePassword: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private cryptoService: CryptojsService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.tokenPassword = this.activatedRoute.snapshot.params['id'];
    if (this.tokenPassword) {
      this.buildForm(this.tokenPassword);
    }
  }

  buildForm(token: number): void {
    this.formChangePassword = this.formBuilder.group({
      tokenPassword: token,
      password: ["", Validators.compose([Validators.required])],
      confirmPassword: ["", Validators.compose([Validators.required])]
    })
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formChangePassword.get(nombreAtributo)?.invalid &&
      (this.formChangePassword.get(nombreAtributo)?.dirty ||
        this.formChangePassword.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formChangePassword.controls;
  }

  get passwordNoValido() {
    return this.isValido('password');
  }

  get confirmPasswordNoValido() {
    return this.isValido('confirmPassword');
  }

  onSubmit() {
    if (this.formChangePassword.invalid) {
      this.formChangePassword.markAllAsTouched();
      return;
    } else {
      this.loader = true;
      let {tokenPassword, password, confirmPassword} = this.formChangePassword.value;
      password = this.cryptoService.encrypt(password);
      confirmPassword = this.cryptoService.encrypt(confirmPassword);
      const payload = {tokenPassword, password, confirmPassword};
      this.authenticationService.changePassword(payload).subscribe({
        next: (r) => {
          let detail = 'La contraseña ha sido actualizada con éxito.';
          this.toastService.showSuccess(r.message, detail);
          setTimeout(()=>{
            this.loader = false;
            this.okChangePassword = true;
          }, 1000)
        },
        error: () => {
          this.loader = false;
        },
      });
    }
  }

  login() {
    this.router.navigate(['account/auth/login']).then();
  }

}
