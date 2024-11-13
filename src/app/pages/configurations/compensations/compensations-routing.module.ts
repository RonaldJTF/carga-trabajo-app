import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListComponent} from "./list/list.component";
import { CompensationComponent } from './compensation/compensation.component';
import { CompensationsComponent } from './compensations.component';

const routes: Routes = [
  {path: '', component: CompensationsComponent, children: [
      {path: '', component: ListComponent},
      {path: 'create', component: CompensationComponent},
      {path: ':id', component: CompensationComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompensationsRoutingModule { }
