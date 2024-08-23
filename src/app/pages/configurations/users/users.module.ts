import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { FormPersonComponent } from './form-person/form-person.component';
import { FormUserPersonComponent } from './form-user-person/form-user-person.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {CurrentPasswordComponent} from "./change-password/menus/current-password.component";
import {NewPasswordComponent} from "./change-password/menus/new-password.component";
import {SharedModule} from "@shared";

@NgModule({
  declarations: [
    UsersComponent,
    ListComponent,
    FormPersonComponent,
    FormUserPersonComponent,
    ChangePasswordComponent,
    CurrentPasswordComponent,
    NewPasswordComponent,
  ],
  imports: [UsersRoutingModule, SharedModule],
})
export class UsersModule {}
