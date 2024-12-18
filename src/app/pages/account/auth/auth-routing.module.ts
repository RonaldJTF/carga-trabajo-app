import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {RecoverPasswordComponent} from "./recover-password/recover-password.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";

@NgModule({
  imports: [RouterModule.forChild([
    {path: 'login',component: LoginComponent},
    {path: 'recover',component: RecoverPasswordComponent},
    {path: 'change-password/:id',component: ChangePasswordComponent}
  ])],
  exports: []
})
export class AuthRoutingModule { }
