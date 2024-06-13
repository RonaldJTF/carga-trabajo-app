import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    SignupComponent, LoginComponent, RecoverPasswordComponent, ChangePasswordComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [],
})
export class AuthModule { }
