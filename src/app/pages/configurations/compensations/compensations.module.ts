import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompensationsRoutingModule } from './compensations-routing.module';
import { CompensationsComponent } from './compensations.component';
import {SharedModule} from "@shared";
import { ListComponent } from './list/list.component';
import { FormCompensationComponent } from './form-compensation/form-compensation.component';


@NgModule({
  declarations: [
    CompensationsComponent,
    ListComponent,
    FormCompensationComponent
  ],
  imports: [
    CommonModule,
    CompensationsRoutingModule,
    SharedModule
  ]
})
export class CompensationsModule { }
