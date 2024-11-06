import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VariablesComponent } from './variables.component';
import { ListComponent } from './list/list.component';
import { VariableComponent } from './variable/variable.component';

const routes: Routes = [{
  path: '', component: VariablesComponent, children: [
    {path: '', component: ListComponent},
    {path: 'create', component: VariableComponent},
    {path: ':id', component: VariableComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariablesRoutingModule { }
