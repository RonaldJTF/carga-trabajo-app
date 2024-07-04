import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {ListComponent} from './list/list.component';
import {FormUserPersonComponent} from './form-user-person/form-user-person.component';
import {FormPersonComponent} from './form-person/form-person.component';
import { superAdminGuard } from 'src/app/guards/super-admin.guard';

const routes: Routes = [
  {
    path: '', component: UsersComponent, children: [
      {path: '', component: ListComponent, canActivate: [superAdminGuard]},
      {path: 'user/:id', component: FormUserPersonComponent, canActivate: [superAdminGuard]},
      {path: 'person', component: FormPersonComponent, canActivate: [superAdminGuard]},
      {path: 'person/:id', component: FormPersonComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
}
