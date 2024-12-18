import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValiditiesComponent } from './validities.component';
import { ListComponent } from './list/list.component';
import { ValidityComponent } from './validity/validity.component';
import {adminGuard, authGuard} from "@guards";

const routes: Routes = [{
  path: '', component: ValiditiesComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: ValidityComponent, canActivate: [adminGuard]},
    {path: ':id', component: ValidityComponent, canActivate: [adminGuard]},
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValiditiesRoutingModule { }
