import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValiditiesComponent } from './validities.component';
import { ListComponent } from './list/list.component';
import { ValidityComponent } from './validity/validity.component';

const routes: Routes = [{
  path: '', component: ValiditiesComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: ValidityComponent},
    {path: ':id', component: ValidityComponent},
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValiditiesRoutingModule { }
