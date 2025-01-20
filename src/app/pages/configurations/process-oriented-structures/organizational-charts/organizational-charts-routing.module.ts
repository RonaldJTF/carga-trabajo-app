import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import {OrganizationChartComponent} from "./organization-chart/organization-chart.component";
import { HierarchyComponent } from './hierarchy/hierarchy.component';

const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'create', component: OrganizationChartComponent},
  {path: ':id', component: OrganizationChartComponent},
  {path: 'hierarchy/create', component: HierarchyComponent},
  {path: 'hierarchy/:id', component: HierarchyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationalChartsRoutingModule { }
