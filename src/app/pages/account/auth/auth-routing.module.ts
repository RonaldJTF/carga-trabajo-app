import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  imports: [RouterModule.forChild([
    {path: 'login',component: LoginComponent},
    {path: 'signup', component: SignupComponent},
  ])],
  exports: []
})
export class AuthRoutingModule { }
