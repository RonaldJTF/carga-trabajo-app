import { NgModule } from '@angular/core';

import { OrganizationalChartsRoutingModule } from './organizational-charts-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModule } from '@shared';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    OrganizationalChartsRoutingModule,
    SharedModule
  ]
})
export class OrganizationalChartsModule { }
