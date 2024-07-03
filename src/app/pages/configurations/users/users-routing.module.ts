import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {ListComponent} from './list/list.component';
import {FormUserPersonComponent} from './form-user-person/form-user-person.component';
import {FormPersonComponent} from './form-person/form-person.component';
import { adminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {
    path: '', component: UsersComponent, children: [
      {path: '', component: ListComponent, canActivate: [adminGuard]},
      {path: 'user/:id', component: FormUserPersonComponent, canActivate: [adminGuard]},
      {path: 'person', component: FormPersonComponent},
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
