import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import {OrganizationChartComponent} from "./organization-chart/organization-chart.component";
import {DependencyComponent} from "./dependency/dependency.component";

const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'create', component: OrganizationChartComponent},
  {path: 'create/:id', component: OrganizationChartComponent},
  {path: 'dependency', component: DependencyComponent},
  {path: 'dependency/:id', component: DependencyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationalChartsRoutingModule { }
