import { NgModule } from '@angular/core';

import { OrganizationalChartsRoutingModule } from './organizational-charts-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '@shared';
import { OrganizationChartComponent } from './organization-chart/organization-chart.component';
import { OrganizationChartMenuItemComponent } from './list/organization-chart-menu-item/organization-chart-menu-item.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';


@NgModule({
  declarations: [
    ListComponent,
    OrganizationChartComponent,
    HierarchyComponent,
    OrganizationChartMenuItemComponent,
    HierarchyComponent
  ],
  imports: [
    OrganizationalChartsRoutingModule,
    SharedModule
  ]
})
export class OrganizationalChartsModule { }
