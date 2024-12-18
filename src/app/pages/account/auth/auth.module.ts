import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {SharedModule} from "@shared";

@NgModule({
  declarations: [
    LoginComponent, RecoverPasswordComponent, ChangePasswordComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [],
})
export class AuthModule { }
