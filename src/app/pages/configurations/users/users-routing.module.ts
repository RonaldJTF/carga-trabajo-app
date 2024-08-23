import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {ListComponent} from './list/list.component';
import {FormUserPersonComponent} from './form-user-person/form-user-person.component';
import {FormPersonComponent} from './form-person/form-person.component';
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {CurrentPasswordComponent} from "./change-password/menus/current-password.component";
import {NewPasswordComponent} from "./change-password/menus/new-password.component";
import {confirmPasswordGuard, superAdminGuard} from "@guards";
const routes: Routes = [
  {
    path: '', component: UsersComponent, children: [
      {path: '', component: ListComponent, canActivate: [superAdminGuard]},
      {path: 'user/:id', component: FormUserPersonComponent, canActivate: [superAdminGuard]},
      {path: 'person', component: FormPersonComponent, canActivate: [superAdminGuard]},
      {path: 'person/:id', component: FormPersonComponent},
      {
        path: 'change-password', component: ChangePasswordComponent,
        children: [
          {path: '', redirectTo: "current-password", pathMatch: "full"},
          {path: 'current-password', component: CurrentPasswordComponent},
          {path: 'new-password', component: NewPasswordComponent, canActivate: [confirmPasswordGuard]}
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
}
