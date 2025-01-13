import { NgModule } from '@angular/core';
import { OperationalManagementRoutingModule } from './operationals-managements-routing.module';
import { SharedModule } from '@shared';
import { ListComponent } from './list/list.component';
import { OperationalManagementComponent } from './operational-management/operational-management.component';


@NgModule({
  declarations: [ListComponent, OperationalManagementComponent],
  imports: [
    OperationalManagementRoutingModule,
    SharedModule
  ]
})
export class OperationalManagementModule { }
