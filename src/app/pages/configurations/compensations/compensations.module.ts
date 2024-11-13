import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CompensationsRoutingModule} from './compensations-routing.module';
import {CompensationsComponent} from './compensations.component';
import {SharedModule} from "@shared";
import {ListComponent} from './list/list.component';
import { CompensationComponent } from './compensation/compensation.component';


@NgModule({
  declarations: [
    CompensationsComponent,
    ListComponent,
    CompensationComponent
  ],
  imports: [
    CompensationsRoutingModule,
    SharedModule,
  ]
})
export class CompensationsModule {
}
