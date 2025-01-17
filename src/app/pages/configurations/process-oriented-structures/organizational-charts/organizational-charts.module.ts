import { NgModule } from '@angular/core';

import { OrganizationalChartsRoutingModule } from './organizational-charts-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '@shared';
import { OrganizationChartComponent } from './organization-chart/organization-chart.component';
import { DependencyComponent } from './dependency/dependency.component';


@NgModule({
  declarations: [
    ListComponent,
    OrganizationChartComponent,
    DependencyComponent
  ],
  imports: [
    OrganizationalChartsRoutingModule,
    SharedModule
  ]
})
export class OrganizationalChartsModule { }
