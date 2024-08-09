import {NgModule} from '@angular/core';
import {WorkplansRoutingModule} from './workplans-routing.module';
import {WorkplansComponent} from './workplans.component';
import {ListComponent} from './list/list.component';
import {WorkplanComponent} from './workplan/workplan.component';
import {SharedModule} from "@shared";

@NgModule({
  declarations: [
    WorkplansComponent,
    ListComponent,
    WorkplanComponent
  ],
  imports: [
    WorkplansRoutingModule,
    SharedModule
  ]
})
export class WorkplansModule {
}
