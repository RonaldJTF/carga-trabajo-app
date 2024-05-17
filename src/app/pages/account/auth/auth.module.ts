import { NgModule } from '@angular/core';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SignupComponent, LoginComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [],
})
export class AuthModule { }
