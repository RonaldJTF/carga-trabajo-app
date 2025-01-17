import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { OperationalManagementComponent } from './operational-management/operational-management.component';
import { adminGuard } from '@guards';

const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'create', component: OperationalManagementComponent, canActivate: [adminGuard]},
  {path: ':id', component: OperationalManagementComponent, canActivate: [adminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationalManagementRoutingModule { }


